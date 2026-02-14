from abc import ABC, abstractmethod

class Entidade(ABC) :
    db_config = {
        "host": "localhost",
        "user": "root",
        "password": "1234",
        "database": "cardapio_digital"
    }

    def __init__(self):
        self.nota = None
        
    @abstractmethod
    def getpreco(self):
        pass

    @abstractmethod
    def getnome(self):
        pass

    @abstractmethod
    def executar(self):
        pass
    