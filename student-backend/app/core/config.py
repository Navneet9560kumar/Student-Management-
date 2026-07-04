from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    # env_file=".env" add kiya taaki local terminal pe bhi variables mil sakein
    model_config = ConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    # CLOUDINARY_CLOUD_NAME: str
    # # CLOUDINARY_API_KEY: str
    # CLOUDINARY_API_SECRET: str
    SECRET_KEY: str = "supersecretkey"
    APP_ENV: str = "development"

settings = Settings()