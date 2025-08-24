import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi import UploadFile
from typing import Optional
import uuid
import asyncio
from config.cloudinary import configure_cloudinary


configure_cloudinary()


class CloudinaryService:
    def __init__(self):
        self._config_verified = False
        self._verify_config()
    def _verify_config(self):
        if not self._config_verified:
            config = cloudinary.config()
            if not all([config.cloud_name, config.api_key, config.api_secret]):
                raise ValueError("Cloudinary configuration is incomplete")
            self._config_verified = True
    
    async def upload_image(self, file: UploadFile, folder: str = "contacts") -> str:
        if not file or not file.filename:
            raise ValueError("No file provided")
        
        if not file.content_type or not file.content_type.startswith("image/"):
            raise ValueError("File must be an image")
        
        if file.size and file.size > 5 * 1024 * 1024:  # 5MB
            raise ValueError("File size must be less than 5MB")
        
        await file.seek(0)
        
        try:
            file_content = await file.read()
            
            if not file_content:
                raise ValueError("File is empty")
          
            upload_result = await self._upload_to_cloudinary(file_content, folder)
            
            return upload_result
            
        except Exception as e:
            raise ValueError(f"Failed to upload image: {str(e)}")
        finally:
            await file.seek(0)
    
    async def _upload_to_cloudinary(self, file_content: bytes, folder: str) -> str:
        
        def sync_upload():

            try:
                result = cloudinary.uploader.upload(
                    file_content,
                    folder=folder,
                    public_id=f"{folder}_{uuid.uuid4().hex[:8]}",
                    resource_type="image",
                    transformation=[
                        {
                            "width": 400, 
                            "height": 400, 
                            "crop": "fill", 
                            "gravity": "auto",
                            "quality": "auto:good"
                        }
                    ],
                    timeout=45  # 45 segundos timeout
                )
                
                return result
                
            except Exception as e:
                print(f"💥 Cloudinary error: {str(e)}")
                raise
        
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, sync_upload)
        
        if not result or not result.get("secure_url"):
            raise ValueError("Upload failed - no URL returned from Cloudinary")
        
        return result.get("secure_url")
    
    def delete_image(self, public_id: str) -> bool:
        """Deleta imagem do Cloudinary"""
        if not public_id:
            return False
            
        try:           
            result = cloudinary.uploader.destroy(public_id, timeout=15)
            success = result.get("result") == "ok"
            return success
            
        except Exception as e:
            return False
    
    def get_public_id_from_url(self, url: str) -> Optional[str]:
        if not url or "cloudinary.com" not in url:
            return None
        
        try:
            parts = url.split("/")
            if "upload" not in parts:
                return None
            
            upload_index = parts.index("upload")
            
            start_index = upload_index + 1
            if start_index < len(parts) and parts[start_index].startswith("v"):
                start_index += 1
            
            if start_index < len(parts):
                file_parts = parts[start_index:]
                file_path = "/".join(file_parts)
    
                public_id = file_path.rsplit(".", 1)[0] if "." in file_path else file_path
                return public_id
            
        except (ValueError, IndexError) as e:
            print(f"❌ Error parsing Cloudinary URL {url}: {str(e)}")
        
        return None