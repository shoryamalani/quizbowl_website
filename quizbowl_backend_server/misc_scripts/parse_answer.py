import re
import jellyfish
def check_answer_from_user(user_answer,correct_answer):
    """
    Checks if the answer provided by the user is correct
    """
    correct_answer = re.sub(r'\([^)]*\)', '', correct_answer)
    correct_answer = re.sub(r'\[[^>]+]', '', correct_answer)
    correct_answer = re.sub(r'&lt[^>]+&gt','',correct_answer)
    correct_answer = re.sub(r'(\b[A-Z][A-Z]+|\b[A-Z]\b)','',correct_answer)
    correct_answer = re.sub(r'[Bb][oO][nN][uU][sS][eE][sS]','',correct_answer)
    correct_answer = re.sub(r'[Bb][oO][nN][uU][sS]','',correct_answer)
    
    correct_answer = correct_answer.replace('"', '')
    correct_answer = correct_answer.replace("alt;", ' ')
    correct_answer = correct_answer.replace("&lt", ' ')
    correct_answer = correct_answer.replace("&gt;", ' ')
    correct_answer = correct_answer.replace("'", '')
    correct_answer = correct_answer.replace("?", '')
    correct_answer = correct_answer.replace(".", '')
    correct_answer = correct_answer.replace("!", '')
    correct_answer = correct_answer.replace(",", '')
    correct_answer = correct_answer.replace(";", '')
    correct_answer = correct_answer.replace("<strong>", ' ')
    correct_answer = correct_answer.replace("</strong>", ' ')
    correct_answer = correct_answer.replace("<br>", ' ')
    correct_answer = correct_answer.replace("<br/>", ' ')
    correct_answer = correct_answer.replace("<u>", ' ')
    correct_answer = correct_answer.replace("</u>", ' ')
    correct_answer = correct_answer.replace("<p>", ' ')
    correct_answer = correct_answer.replace("</p>", ' ')
    correct_answer = correct_answer.replace("<em>", ' ')
    correct_answer = correct_answer.replace("</em>", ' ')

    correct_answer = correct_answer.strip()
    distance = jellyfish.damerau_levenshtein_distance(user_answer.lower(), correct_answer.lower())
    print(distance)
    if distance<len(user_answer)*0.4:
        return [True, correct_answer]
    return [False, correct_answer]

def parse_question(question):
    question = re.sub(r'\([^)]*\)', '', question)
    question = re.sub(r'\[[^>]+]', '', question)
    question = re.sub(r'&lt[^>]+&gt','',question)
    question = re.sub(r'(\b[A-Z][A-Z]+|\b[A-Z]\b)','',question)
    question = re.sub(r'[Bb][oO][nN][uU][sS][eE][sS]','',question)
    question = re.sub(r'[Bb][oO][nN][uU][sS]','',question)
    
    # question = question.replace('"', '')
    question = question.replace("alt;", ' ')
    question = question.replace("&lt", ' ')
    question = question.replace("&gt;", ' ')
    # question = question.replace("'", '')
    # question = question.replace("?", '')
    # question = question.replace(".", '')
    # question = question.replace("!", '')
    # question = question.replace(",", '')
    # question = question.replace(";", '')
    question = question.replace("<strong>", ' ')
    question = question.replace("</strong>", ' ')
    question = question.replace("<br>", ' ')
    question = question.replace("<br/>", ' ')
    question = question.replace("<u>", ' ')
    question = question.replace("</u>", ' ')
    question = question.replace("<p>", ' ')
    question = question.replace("</p>", ' ')
    question = question.replace("<em>", ' ')
    question = question.replace("</em>", ' ')
    question = question.replace("<b>", ' ')
    return question
