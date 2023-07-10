import json


def validate_jsonl(filename):
    with open(filename, 'r') as file:
        for line_no, line in enumerate(file, start=1):
            try:
                json.loads(line)
            except json.JSONDecodeError as e:
                print(f'Invalid JSON at line {line_no}: {e}')


validate_jsonl('collection.jsonl')
