
// CREATE TABLE User (
//   UserId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   Username VARCHAR(50) NOT NULL,
//   Email VARCHAR(100) NOT NULL,
// );

// -- Table to store uploaded test data
// CREATE TABLE TestData (
//   TestId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   QuestionId SERIAL,
//   QuestionText TEXT NOT NULL,
//   Options TEXT[] NOT NULL,
//   NextQuestionId INT[] -- Array of next question IDs based on option selection
// );

// -- Table to store user test results
// CREATE TABLE TestResult (
//   ResultId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   UserId UUID REFERENCES User(UserId) ON DELETE CASCADE,
//   TestId UUID REFERENCES TestData(TestId),
//   QuestionId INT REFERENCES TestData(QuestionId),
//   SelectedOption INT,
//   TestDateTime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//   TimeTakenInSeconds INT, 
// );
