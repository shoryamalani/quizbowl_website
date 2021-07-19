import re
import jellyfish
def check_answer_from_user(user_answer,correct_answer):
    """
    Checks if the answer provided by the user is correct
    """
    correct_answer = re.sub(r'\([^)]*\)', '', correct_answer)
    correct_answer = re.sub(r'\[[^>]+]', '', correct_answer)
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
    if distance<len(user_answer)*0.2:
        return [True, correct_answer]
    return [False, correct_answer]