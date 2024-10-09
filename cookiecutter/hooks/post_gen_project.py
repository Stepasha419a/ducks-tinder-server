# cat post_gen_project.py
import os
import shutil

print(os.getcwd())  # prints /absolute/path/to/{{cookiecutter.project_slug}}

def remove(filepath):
    if os.path.isfile(filepath):
        os.remove(filepath)
    elif os.path.isdir(filepath):
        shutil.rmtree(filepath)

has_grpc_server = '{{cookiecutter.has_grpc_server}}' == 'True'

if not has_grpc_server:
    # remove top-level file inside the generated folder
    remove(os.path.join('internal', 'domain', 'repository'))
