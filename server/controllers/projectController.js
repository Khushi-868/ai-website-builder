// POST/api/projects/:projectId/files
//Create a new file project from an AI prompt
import { Project } from '../models/Project.js';
import { generateProject } from '../services/ai.js';
import { validateAndFixCode } from '../services/codeValidator.js';
import crypto from 'crypto';
function hashContent(content){
    return crypto.createHash('md5').update(content).digest('hex').slice(0,12);
}

export async function createProject(req,res ){
    const { prompt } = req.body;
    if(!prompt || typeof prompt !== 'string' ){
         res.status(400).json({ error: 'Prompt is required' });
        return;
    }
    if(!req.user)
    {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    //C
    const project =await Project.create(
        {
            name: "Planning project...",
            description:prompt,
            files:{},
            messages:[
                {role:"user",content:prompt},
                {role:"assistant",content:"Generating project files..."},
            ],
            version:0,
            owner :req.user.userId,
            status:"pending",
            filesPlanned:[],
            filesGenerated:[],
            currentFile :null,
            error:null,
        }
    )
    //Start backgrounfd  generation of files
    runBackgroundGeneration(project._id.toString(),prompt).catch((err)=>{
        console.error(`[Background AI] Fatal generation  error for project ${project._id}`,err);

    });
    res.status(201).json({ 
        _id :project._id,
        name:project.name,
        description:project.description,
        files:{},
        messages:project.messages,
        version:project.version,
        status: project.status,
        filesPlanned:project.filesPlanned,
        filesGenerated:project.filesGenerated,
        currentFile:project.currentFile,
        error:project.error,
        createdAt:project.createdAt,

     });

   
}

//Background worker to progressive generate files and update database in real-time
async function runBackgroundGeneration(projectId, prompt) {
    try {
        console.log(`[Background AI] Starting generation for project ${projectId}`);
        const result = await generateProject(prompt, {
            onPlan: async (plan) => {
                console.log(`[Background AI] Starting generation for project ${projectId}. Planned ${plan.files.length} files`);
                const filesList = plan.files.map((f) => `- \`${f.path}\`: ${f.description}`).join("\n");
                await Project.findByIdAndUpdate(projectId, {
                    name: plan.projectName || "Generated Project",
                    status: "generating",
                    filesPlanned: plan.files,
                    $push: {
                        messages: {
                            role: "assistant",
                            content: `Planned ${plan.files.length} files:\n${filesList}`,
                            timestamp: new Date(),
                        }
                    }
                });
            },
            onFileStart: async (path) => {
                   console.log(`[Background AI] Starting generation of file ${path} for project ${projectId}`);
                   await Project.findByIdAndUpdate(
                          projectId,{
                            currentFile:path,
                          }
                   )
            },
            onFileComplete: async (path, code) => {
                console.log(`[Background AI] Finished file ${path} for project ${projectId}`);
                
                // Validate and fix code (e.g. self-closing tags, escaped quotes in JSX)
                const validationResult = validateAndFixCode(code, path);
                const finalCode = validationResult.code;

                const project = await Project.findById(projectId);
                if (project) {
                    project.files = project.files || {};
                    project.files[path] = {
                        content: finalCode, hash: hashContent(finalCode)
                    };
                    project.filesGenerated = [
                        ...(project.filesGenerated || []), path
                    ];
                    project.messages.push({
                        role:"assistant",
                        content:`Create file "${path}`,
                        timestamp:new Date(),
                    });
                     project.currentFile =null;
                     project.markModified("files");
                     await project.save();
                }
            }
        });
         console.log(`[Background AI] Finished file  for project ${projectId}`);
         const project=await Project.findById(projectId);
         if(project){
            project.status="completed";
            project.version=1;
            if(result.description){
                project.name=result.description;
            }
            project.messages.push({
                role:"assistant",
                content:`Website generation complete ! You can view and edit the files.`,
                timestamp:new Date(),
            })
            await  project.save();
         }
        
    } catch (err) {
        console.error(`[Background AI] Fatal generation error for project ${projectId}`, err);
        await Project.findByIdAndUpdate(projectId,{
            status:"failed",
            error:err.message,
            $push:{
                messages:{
                    role:"assistant",
                    content:`❌ Generation failed : ${err.message}`,
                    timestamp:new Date(),
                }
            }
        })
    }
}

//GET /api/projects

export async function listProjects(req,res){
    if(!req.user)
    {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const projects=await Project.find(
        {owner :req.user.userId},
        {name:1 ,description:1,version:1,createdAt:1,updatedAt:1}
    ).sort({updatedAt:-1});
    res.json(projects);


}

export async function getProject(req,res){

if(!req.user)
    {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const project =await Project.findOne(
        {_id:req.params.projectId,owner:req.user.userId}
    );
    if(!project)
    {
        res.status(404).json({ error: 'Project not found' });
        return;
    }
    const filesObj={};
    for(const[path,entry] of Object.entries(project.files)){
        filesObj[path]=entry.content;
    }
    res.json({
          _id :project._id,
        name:project.name,
        description:project.description,
        files:filesObj,
        messages:project.messages,
        version:project.version,
        status: project.status,
        filesPlanned:project.filesPlanned,
        filesGenerated:project.filesGenerated,
        currentFile:project.currentFile,
        error:project.error,
        createdAt:project.createdAt,
        updatedAt:project.updatedAt,
    })
}
export async function deleteProject(req,res){
    if(!req.user)
    {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const result= await Project.findOneAndDelete({_id:req.params.projectId,owner:req.user.userId});
    if(!result)
    {
        res.status(404).json({ error: 'Project not found' });
        return;
    }
    res.json({success:true,message:"Project deleted successfully"});


}
export async function updateProjectFiles(req,res){
    const { files } = req.body;
    if(!files || typeof files !== 'object' ){
         res.status(400).json({ error: 'Files object is required' });
        return;
    }
    if(!req.user)
    {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }   
    const project =await Project.findOne({_id:req.params.projectId,owner:req.user.userId});
    if(!project)
    {
        res.status(404).json({ error: 'Project not found' });
        return;
    }
    //Rebuild project files
    const newFiles={};
    for(const[path,content] of Object.entries(files)){
        if(typeof content === 'string'){

            newFiles[path]={content,hash:hashContent(content)};
        }
    }
    project .files=newFiles;
    await project.save();
    const filesObj={};
    for(const[path,entry] of Object.entries(project.files)){
         filesObj[path] = entry.content;
    }
    res.json({
           _id :project._id,
        name:project.name,
        description:project.description,
        files:filesObj,
        messages:project.messages,
        version:project.version,
        createdAt:project.createdAt,
        updatedAt:project.updatedAt,
    })


}
//POST /api/projects/:projectId/publish
//Mark a project as published and make it publicly accessible
export async function publishProject(req,res){
    if(!req.user)
    {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const project =await Project.findOneAndUpdate(
        {_id:req.params.projectId,owner:req.user.userId},
        
        {published:true},
        {returnDocument:'after'},
    );
    if(!project)
    {
        res.status(404).json({ error: 'Project not found' });
        return;
    }
    res.json({success:true,published:project.published});
}
//GET /api/projects/:projectId/published
export async function getPublishedProject(req,res){
const project =await Project.findById(req.params.projectId);
    if(!project)
    {
        res.status(404).json({ error: 'Project not found' });
        return;
    }
    if(!project.published)
    {
        res.status(403).json({ error: 'Project is not published' });
        return;
    }
    const filesObj={};
    for(const[path,entry] of Object.entries(project.files)){
       
        filesObj[path]=entry.content;
        
    }
    res.json({
           _id :project._id,
        name:project.name,
        description:project.description,
        files:filesObj,
     
        version:project.version,
       
    })


}