import os
import re

mig_dir = "/media/akaun/Project_1/CAMPOPRO/db/migrations"

# Match CREATE POLICY "name" ON table_name
# Also support CREATE POLICY name ON table_name
policy_pattern = re.compile(r'CREATE\s+POLICY\s+("?[a-zA-Z0-9_ ]+"?)\s+ON\s+(public\.)?([a-zA-Z0-9_]+)', re.IGNORECASE)

for filename in os.listdir(mig_dir):
    if not filename.endswith(".sql"):
        continue
    filepath = os.path.join(mig_dir, filename)
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    new_lines = []
    for line in lines:
        match = policy_pattern.search(line)
        if match:
            policy_name = match.group(1)
            table_name = match.group(3)
            # Add DROP POLICY IF EXISTS before
            new_lines.append(f'DROP POLICY IF EXISTS {policy_name} ON {table_name};\n')
        new_lines.append(line)
        
    with open(filepath, 'w') as f:
        f.writelines(new_lines)
        
print("Done fixing policies.")
