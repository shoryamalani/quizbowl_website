import re
import jellyfish
import textblob
import spacy


nlp = spacy.load("en_core_web_md")  # Load the English language model


def answer_is_correct(answer,correct_answer):
    distance = jellyfish.damerau_levenshtein_distance(answer.lower(), correct_answer.lower())
    if distance<len(answer)*0.2:
        return True
def are_all_words_contained(string1, string2):
    words1 = string1.split()  # Split the first string into words
    words2 = string2.split()  # Split the second string into words
    for word in words1:
        if word not in words2:  # Check if the word is not in the second string
            return False
    return True
def check_answer_from_user(user_answer,correct_answer):
    """
    Checks if the answer provided by the user is correct
    """
    #change string number to word form (e.g. 1 to one)
    # user_answer = textblob.TextBlob(user_answer).correct()
    try:
        user_answer = int(user_answer.split(" ")[0])
        user_answer = textblob.TextBlob(user_answer).words[0].singularize() + textblob.TextBlob(user_answer).words[1:]
    except:
        pass
    user_answer = str(user_answer)
    possible_answers = []
    doc = nlp(correct_answer)
    for chunk in doc.noun_chunks:
        possible_answers.append(chunk.text)
    for a in possible_answers:
        if answer_is_correct(user_answer,a):
            return True,a
        else:
            for b in a.split(" "):
                if answer_is_correct(user_answer,b):
                    return True,a
    # check if all the words in the user answer are in the correct answer
    for a in possible_answers:
        if are_all_words_contained(user_answer,a):
            return True,a
    # correct_answer = correct_answer.split(" ")
    # for a in user_answer:
    #     correct = True
    #     for b in possible_answers:
    #         if a not in b:
    #             correct = False
    #     if correct:
    #         return True,a
    return False,user_answer

def test_answers():
    test_cases = [
        ["Burials [accept funerals; prompt on death, do not accept cremation]", "funerals",True],
        ["Burials [accept funerals; prompt on death, do not accept cremation]", "cremation",False],
        ["Burials [accept funerals; prompt on death, do not accept cremation]", "burials",True],
        ["Burials [accept funerals; prompt on death, do not accept cremation]", "burial",True],
        ["Burials [accept funerals; prompt on death, do not accept cremation]", "funeral",True],
        ['scientific management [or Taylorism before Taylor is mentioned]', 'scientific management',True],
        ['scientific management [or Taylorism before Taylor is mentioned]', 'taylorism',True],
        ['scientific management [or Taylorism before Taylor is mentioned]', 'before',False],
        ['scientific management [or Taylorism before Taylor is mentioned]', 'mentioned',False],
        ['Caesar Domitianus Augustus or Titus Flavius Domitianus', 'Caesar Domitianus Augustus',True],
        ['Caesar Domitianus Augustus or Titus Flavius Domitianus', 'Caesar Flavius Domitianus',False],
        ['Caesar Domitianus Augustus or Titus Flavius Domitianus', 'Titus Flavius Domitianus',True],
        ['Caesar Domitianus Augustus or Titus Flavius Domitianus', 'Caesar',True],
        ['Caesar Domitianus Augustus or Titus Flavius Domitianus', 'Domitianus',True],
        ['Caesar Domitianus Augustus or Titus Flavius Domitianus', 'Caesar Augustus',True],
    ]
    for test_case in test_cases:
        user_answer = test_case[1]
        correct_answer = test_case[0]
        expected_result = test_case[2]
        if expected_result == False:
            a = 1
        result,answer = check_answer_from_user(user_answer,correct_answer)
        print(result, expected_result)
    
if __name__ == "__main__":
    test_answers()
