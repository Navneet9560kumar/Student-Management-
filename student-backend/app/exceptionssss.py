from fastapi import HTTPException, Request
from fastapi.responses import  JSONResponse

class UnicornException(Exception):
      def __init__(self, name:str):
            self.name =name



async def unicorn_exception_handler(request: Request, exc : UnicornException):
      print(exc.name)
      return JSONResponse(
            
      status_code=418,
      content={"message": f"Ooops!{exc.name} did something .There gose a rainbow...."}

      )
    
