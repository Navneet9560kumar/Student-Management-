from enum import Enum 

class Role(str, Enum):
        PRINCIPAL = "principal"
        TEACHER = "teacher"
        STUDENT = "student"
   

ROLE_PERMISSIONS ={
        Role.PRINCIPAL: [
                "student: read",
                "student: create",
                "student: update",
                "student: delete",
                "course:read",
                "course: create",
                "course:update",
                "course:delete",
               "enrollment:read",
               "enrollment: create",
                 "document:read",
                   "document:uplode",
                     "document:delete",
             ],
             Role.TEACHER: [
                  "student:read",
                  "course:read",
                  "enrollment:read",
                  "document:read",
                  ],
            Role.STUDENT: [
        "student:read_own",    
        "document:read_own", 
        "enrollment:read_own", 
    ],
}


def get_permissions(role:Role)->list:
        return ROLE_PERMISSIONS(role, [])


def has_permission(role:Role, permission:str) -> bool:
        return permission in ROLE_PERMISSIONS.get(role,[])