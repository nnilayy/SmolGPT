import os
import tempfile
import streamlit as st
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI

from helper_classes.model import Model
from helper_classes.scan_documents import ScanDocuments
from helper_classes.vector_store import VectorStore

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
model = Model(llm,embeddings)

def save_uploaded_file(uploaded_file):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=uploaded_file.name) as tmp_file:
            tmp_file.write(uploaded_file.getvalue())
            return tmp_file.name
    except Exception as e:
        st.error(f"Error handling file: {e}")
        return None

def main():
    
    st.title('Document Processing App')

    uploaded_file = st.file_uploader("Upload your file", type=['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'md', 'csv'])

    if uploaded_file is not None:
        temp_file_path = save_uploaded_file(uploaded_file)
        if temp_file_path:
            uploader = ScanDocuments()
            vector_db = VectorStore(model, search_num_docs=10)
            try:
                data = uploader.upload_single_file(temp_file_path)
                documents = uploader.process_document(data)
                vector_db.add_documents(documents)
                st.write("Processed Documents:")
                for doc in documents:
                    st.write(doc)
            except Exception as e:
                st.error(f"Failed to process document: {e}")
            finally:
                os.unlink(temp_file_path)  # Clean up the temporary file

if __name__ == "__main__":
    main()
