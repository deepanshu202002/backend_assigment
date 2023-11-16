const xlsx = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient({
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6I<kpXVCJ9.eyJpbvfbgbg>iJzdXBhYmFzZSIsInJlZiI6Im5lYm1oa3NpcHpqZWp1bXF1c2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwNTc4MzksImV4cCI6MjAxNTYzMzgzOX0.deJ6vb-erTYmMJlJvGscbMlsC7qjEQ2Z7LG9gDFuP8k',
  apiUrl: 'https://ne<bmhksipzvfvvvfvfv>l.supabase.co',
});
// Controller to get users from Supabase
exports.getUsers = async (req, res) => {
    try {
      const { data, error } = await supabase.from('User').select('*');
  
      if (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      res.status(200).json({ users: data });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
exports.uploadTestData = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // Extract data from the workbook and store in the database
    const testData = xlsx.utils.sheet_to_json(sheet);

    // Store quiz data in Supabase
    const { data, error } = await supabase.from('TestData').upsert(testData);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error uploading quiz data to Supabase.' });
      }
  
      res.status(200).json({ message: 'Test data uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  
};

exports.startTest = async (req, res) => {
  try {
    // Fetch the first question from the uploaded test data

    const { data, error } = await supabase.from('TestData').select('*').limit(1);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching the first question from Supabase.' });
    }

    const firstQuestion = data[0];
    res.status(200).json({ question: firstQuestion.question, options: firstQuestion.options });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getQuestion =async (req, res) => {
  try {
    // Fetch specific question based on the questionId
    const questionId = req.params.questionId; // Assuming questionId is passed as a route parameter
    const { data, error } = await supabase.from('Testdata').select('*').eq('questionId', questionId);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching the specific question from Supabase.' });
    }

    const question = data[0];
    res.status(200).json({ question: question.question, options: question.options });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });

   
  }
};

exports.redirectUser = async (req, res) => {
  try {
    // Determine the next question based on the user's selected option
    const userId = req.params.userId; // Assuming userId is passed as a route parameter
    const selectedOption = req.body.selectedOption; // Assuming selectedOption is sent in the request body

    // Determine the next question based on the user's selected option
    const { data, error } = await supabase.from('TestData').select('*').eq('question', selectedOption);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error determining the next question from Supabase.' });
    }

    const nextQuestion = data[0];
    res.status(200).json({ question: nextQuestion.question, options: nextQuestion.options });
  } catch (error) {
    console.error(error);
    res.status(200).json({ question: 'Next question', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] });
};
}

exports.storeUserTestResult = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed as a route parameter
    const testDateTime = req.params.testDateTime; // Assuming testDateTime is passed as a route parameter
    const userResponse = req.body.userResponse; // Assuming userResponse is sent in the request body

    // Store user test result in Supabase 
    const { data, error } = await supabase.from('TestResult').upsert([
      {
        user_id: userId,
        test_datetime: testDateTime,
        user_response: userResponse,
      },
    ], { onConflict: ['user_id', 'test_datetime'] });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error storing user test result in Supabase.' });
    }

    res.status(200).json({ message: 'User test result stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getResult = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed as a route parameter
    const testDateTime = req.params.testDateTime; // Assuming testDateTime is passed as a route parameter

    // Fetch user's test result based on userId and testDateTime from Supabase 
    const { data, error } = await supabase
      .from('TestResult')
      .select('*')
      .eq('user_id', userId)
      .eq('test_datetime', testDateTime);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching user test result from Supabase.' });
    }

    // Assuming the result is a single record
    const userTestResult = data[0];

    if (!userTestResult) {
      return res.status(404).json({ message: 'User test result not found' });
    }

    res.status(200).json({ result: userTestResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllTestResults = async (req, res) => {
  try {
    const page = req.query.page || 1; // Assuming pagination is done using query parameters
    const pageSize = 10; // Number of results per page

    // Fetch all test results in a paginated format from Supabase 
    const { data, error } = await supabase
      .from('TestResult')
      .select('*')
      .range((page - 1) * pageSize, page * pageSize);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching all test results from Supabase.' });
    }

    res.status(200).json({ results: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
