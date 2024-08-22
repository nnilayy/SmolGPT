import logging

logging.basicConfig(level=logging.INFO)

class Model:
    def __init__(self, llm, embeddings):
        self.llm = llm
        self.embeddings = embeddings