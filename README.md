# Heroku

https://fast-waters-42231.herokuapp.com/ | https://git.heroku.com/fast-waters-42231.git

# Frequently Asked Questions

Build a knowledge-base system where users can post and answer questions. You can choose the topic. Some suggestions might include University procedures or NodeJS.

---

## Testing

The system should include the data for at least 5 valid questions and each question must contain at least 3 answers containing sensible comments posted from from valid user accounts (see below).

You are required to create the following accounts to allow the system to be tested. All accounts should have the password `p455w0rd`:

1. `user1`
2. `user2`
3. `user3`

---

## Stage 1

The core functionality consists of three screens:

### Part 1

The home screen should be visible without needing to log in should display a list of the questions that `users` have asked. This should include:

1. The title
2. A short multi-line summary of no more than 250 characters.
3. The username of the person asking the question.
3. The status from the following:
    1. unanswered (no-one has provided an answer).
    2. answered (there is at least one answer provided).
    3. solved (the person asking the question has flagged an answer as correct).

### Part 2

There should be a button or link on the homepage that takes `users` to a screen where they can ask their own questions. They should supply:

1. A brief title
2. A short multi-line summary of no more than 250 characters.
3. A detailed, formatted, multi-line description of the question.
4. an optional image (screenshot or photo) that should be uploaded from their computer.

### Part 3

If the `user` clicks on one of the titles on the homepage they should be taken to the details page which includes the following features:

1. The title, summary and description of the problem
2. A multiline, formatted input box to allow `users` to answer the question.
3. If the logged-in `user` was the one who posted the question they should be able to flag one of the answers as correct.

---

## Stage 2

The intermediate tasks require you to make changes to the functionality:

1. To help users locate answers you will need to implement keyword tags. Each question must provide between one and five keywords. The user should be given the choice of choosing any existing tag or, if the one they one is not available, be able to add their own.
2. The homepage should include a list of all the keywords currently used in the FAQ and, for each keyword, the number of questions that used that tag. Clicking on one of these should filter the list of questions to only include those that used that tag.
3. If someone posts an answer to a question posted by a user they should receive an email notification which includes:
    1. The original question
    2. The proposed answer
    3. A link to the question details page