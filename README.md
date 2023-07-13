used openai api fine_tunes.create -t collection.jsonl -m curie --suffix "codenected" to create first model "curie:ft-personal:codenected-2023-07-05-04-07-04"

used openai api fine_tunes.create -t collection.jsonl -m davinci --suffix "codenected" to create first model 


useful commmands:
openai api fine_tunes.create -t collection.jsonl -m davinci --suffix "codenected"
export OPENAI_API_KEY=""
openai api completions.create -m curie:ft-personal:codenected-2023-07-05-04-07-04 -p 
"What is codenected?"
openai tools fine_tunes.prepare_data -f collections.jsonl