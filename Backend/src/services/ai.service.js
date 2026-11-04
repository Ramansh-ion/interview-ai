
import { GoogleGenAI } from "@google/genai";
import z from "zod"


console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

const toGeminiSchema = (schema) => {
  const { $schema, ...rest } = z.toJSONSchema(schema);
  return rest;
};
    const interviewReportSchema = z.object({
         matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })).min(5).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(3).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).min(3).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).min(7).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
    })

   export const generateInterviewReport = async ({
    resume,
    selfDescription,
    jobDescription
}) => {


        const prompt = `
You are an expert technical interviewer and career advisor.

Analyze the candidate's profile against the job description.

Generate a complete and personalized interview preparation report.

Candidate Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}

STRICT REQUIREMENTS:

1. matchScore:
   Give a score between 0 and 100.

2. title:
   Extract the actual job title from the job description.

3. technicalQuestions:
   Generate at least 5 technical interview questions.
   Each must contain question, intention and answer.

4. behavioralQuestions:
   Generate at least 3 behavioral interview questions.
   Each must contain question, intention and answer.

5. skillGaps:
   Generate at least 3 relevant skill gaps.
   Each must contain skill and severity.
   Severity must be low, medium or high.

6. preparationPlan:
   Generate a complete 7-day preparation plan.
   Each day must contain day, focus and tasks.

IMPORTANT:
- Never return empty arrays.
- Never omit any required fields.
- Provide detailed, personalized answers.
- Base the report on the actual candidate profile.
- Return valid JSON matching the supplied response schema.
`;




      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // responseSchema: zodToJsonSchema(interviewReportSchema),
            responseJsonSchema: toGeminiSchema(interviewReportSchema),
        },
    })
    console.log("RAW GEMINI RESPONSE:", response.text);
    // return JSON.parse(response.text)
    const parsedResponse = JSON.parse(response.text);
    console.log("PARSED GEMINI RESPONSE:", JSON.stringify(parsedResponse, null, 2));

const validatedResponse = interviewReportSchema.parse(parsedResponse);

return validatedResponse;

};
    

   export const generatePdfFromHtml = async ({htmlContent }) =>{
        const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
    }

   export const generateResumePdf = async ({resume, selfDescription, jobDescription})=>{
        const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // responseSchema: zodToJsonSchema(resumePdfSchema),
            responseJsonSchema: toGeminiSchema(interviewReportSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml({
         htmlContent:jsonContent.html})

    return pdfBuffer

    }

