# TicTacTrip exercise

An API that justify a text given as parameter

# How to use it 

First do a POST request on /api/token with a JSON body {"email": "foo@bar.com"}
API responde with a Token that you have to store in your header as 'x-access-token'

Then POST your text on /api/justify with a body {"text": "A text..."}
API respond with your text justify with 80 chararacters by line

/!\ You can justify 80 000 words per day 

# In the future 
  - Payment module that allow you to break the limit and justify more than 80 000 words !
  - Choose the number of chararacters by line !