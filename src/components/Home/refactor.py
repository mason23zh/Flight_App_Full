import os

# Get the current directory
current_directory = os.getcwd()

# List all files in the current directory
file_list = os.listdir(current_directory)

# Iterate through the files
for filename in file_list:
    if filename.endswith(".jsx"):
        # Create the new filename by replacing .jsx with .tsx
        new_filename = filename.replace(".jsx", ".tsx")

        # Rename the file
        os.rename(os.path.join(current_directory, filename), os.path.join(current_directory, new_filename))
        print(f"Renamed {filename} to {new_filename}")
