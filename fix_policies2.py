import os
import re

mig_dir = "/media/akaun/Project_1/CAMPOPRO/db/migrations"

# Match CREATE POLICY "name" ON table_name
# using re.DOTALL or just \s+ to match newlines
policy_pattern = re.compile(r'(CREATE\s+POLICY\s+("?[a-zA-Z0-9_ ]+"?)\s+ON\s+(public\.)?([a-zA-Z0-9_]+))', re.IGNORECASE)

for filename in os.listdir(mig_dir):
    if not filename.endswith(".sql"):
        continue
    filepath = os.path.join(mig_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
        
    # We want to insert DROP POLICY IF EXISTS before CREATE POLICY.
    # But wait, what if it ALREADY has DROP POLICY IF EXISTS? We shouldn't duplicate it.
    
    # First, let's remove any previously added DROP POLICY IF EXISTS to avoid duplicates
    content = re.sub(r'DROP POLICY IF EXISTS [^\n]+;\n', '', content)
    
    def replacer(match):
        full_create = match.group(1)
        policy_name = match.group(2)
        table_name = match.group(4)
        return f'DROP POLICY IF EXISTS {policy_name} ON {table_name};\n{full_create}'
        
    new_content = policy_pattern.sub(replacer, content)
        
    with open(filepath, 'w') as f:
        f.write(new_content)
        
print("Done fixing policies properly.")
