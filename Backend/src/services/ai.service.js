const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema  } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});


const invokeGeminiAi = async () => {
    const response = await ai.models.generateContent({
        model: process.env.GEMINI_AI_MODEL,
        contents: "How is wheather in Rishikesh, today?"
    });

    console.log(response.text);
}


const interviewReportSchema = z.object({
    title: z.string().describe("Job title"),
    matchScore: z.number().describe("A score between 0 to 100 how well candidate's profile matches with the job description"),
    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("A technical question that can be asked in the interview"),
            intention: z.string().describe("The intention of interviewer behind asking the question"),
            answer: z.string().describe("How to answer the question, what points to cover, what approach to take, etc")
        })
    ).describe('Technical question that can be asked in the interview, their purpose and how to answer them'),
    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe("A behavioral question that can be asked in the interview"),
            intention: z.string().describe("The intention of interviewer behind asking the question"),
            answer: z.string().describe("How to answer the question, what points to cover, what approach to take, etc")
        })
    ).describe('Behavioral question that can be asked in the interview, their purpose and how to answer them'),
    skillsGap: z.array(
        z.object({
            skill: z.string().describe("The skill which candidate is lacking"),
            severity: z.enum(["low", "medium", "high"]).describe("The severity of skill gap, i.e, how important is this skill for the job")
        })
    ).describe(`List of skill gaps in candidate's profile along with their severity`),
    preparationPlan: z.array(
        z.object({
            day: z.number().describe("The day number in preparation plan, starting from 1"),
            focus: z.string().describe("The main focus of this day in the preparation plan, e.g, cloud exposure, system design, gen-ai, fundamentals, data structures, etc"),
            tasks: z.string().describe("List of tasks to be done on this day to follow the preparation plan ")
        })
    ).describe('A day-wise preparation plan for a candidate to follow in order to prepare for the interview'),
});

const exampleOutput = {
  title: "Senior Backend Engineer",
  matchScore: 85,
  technicalQuestions: [
    {
      question: "Example?",
      intention: "Check knowledge",
      answer: "Explain clearly"
    }
  ],
  behavioralQuestions: [
    {
      question: "Example?",
      intention: "Check behavior",
      answer: "Use STAR method"
    }
  ],
  skillsGap: [
    {
      skill: "Azure",
      severity: "high"
    }
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "System Design",
      tasks: "Study basics"
    }
  ]
};


const jsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    matchScore: { type: "number" },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    skillsGap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] }
        },
        required: ["skill", "severity"]
      }
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: { type: "string" }
        },
        required: ["day", "focus", "tasks"]
      }
    }
  },
  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillsGap",
    "preparationPlan"
  ]
};


const generateInterviewReport = async ({ resume, selfDescription, jobDescription}) => {

    // const jsonSchema = zodToJsonSchema(interviewReportSchema);

    const prompt2 = `Calculate the match-score, provide technical, behavioral questions that can be asked in the interview, identify skill-gaps, prepare a day-wise preparation-plan for a candidate in a required structure using the following details:
                    Resume: ${resume} 
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription} 
    `;

    const prompt = `
    You must return ONLY valid JSON.

    STRICT REQUIREMENTS:
    - Follow this JSON schema EXACTLY
    - Do not add extra fields
    - Do not remove fields
    - Do not rename fields
    - Use exact casing
    - Do NOT wrap response in markdown (no \`\`\`json)
    - Arrays like technicalQuestions MUST contain objects, not flattened strings
    - Add title field (job title) as well in the output

    Follow this EXACT structure:
    ${JSON.stringify(exampleOutput, null, 2)}

    Now generate response for:

    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    `;

    const response = await ai.models.generateContent({
        model: process.env.GEMINI_AI_MODEL,
        contents: prompt,
        config: {
            temperature: 0.2, // reduce creativity
            responseMimeType: "application/json",
            responseSchema: jsonSchema
        }
    });

    const parsed = JSON.parse(response.text);

    const validated = interviewReportSchema.parse(parsed);
    
    return validated;

}


const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ 
    format: "A4",
    margin: {
      bottom: "15rem",
      top: "15rem",
      left: "20rem",
      right: "20rem"
    }
  });
  
  await browser.close();

  return pdfBuffer;
}

const generateResumePdf = async ({ resume, selfDescription, jobDescription}) => {

  const resumePdfSchema = z.object({
    html: z.string().describe("The content of the resume which can be converted to PDF using any library like puppeteer")
  });

  const prompt = `Generate a resume for a candidate  with the following details:
                  Resume: ${resume},
                  Self Description: ${selfDescription}
                  Job Description: ${jobDescription}

                  The response should be a  JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                  The resume should be tailored for the given job description and should highlight the candidate's strength and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visible.
                  The content of the resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                  You can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                  Overall content should match candidate's experience and education.
                  The content should be ATS friendly. 
  `;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_AI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema)
    }
  })

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}


module.exports = { invokeGeminiAi, generateInterviewReport, generateResumePdf };