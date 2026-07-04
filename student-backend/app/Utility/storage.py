import os 
import uuid

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


IMAGE_DIR = os.path.join(BASE_DIR, "media")
os.makedirs(IMAGE_DIR, exist_ok=True)


def save_file_to_disk(file_bytes:bytes, original_filename:str, folder:str ="students")-> tuple[str,str]:
    #Extesion nikalo
    #folder ka path banao aur check karo
    file_ext = os.path.splitext(original_filename)[1]
    unique_name = f"{uuid.uuid4().hex[:12]}{file_ext}"
    folder_path = os.path.join(IMAGE_DIR, folder)
    os.makedirs(folder_path, exist_ok=True)
    #file save karo 
    file_path = os.path.join(folder_path, unique_name)
    with open(file_path, "wb") as f:
        f.write(file_bytes)

        #url banao
    file_url = f"/media/{folder}/{unique_name}"
    return unique_name, file_url

       
       
