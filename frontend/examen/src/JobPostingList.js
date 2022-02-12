import { useEffect, useState } from "react";
import store from './JobPostingStore'
import JobPostingAddForm from "./JobPostingAddForm";
import JobPosting from "./JobPosting";

function JobPostingList() {
    const [jobpostings, setJobPostings] = useState([]);

    useEffect(() => {
        store.getJobPostings();
        store.emitter.addListener('GET_JOBPOSTINGS_SUCCESS', () => {
            setJobPostings(store.data);
        })
    }, [])


    const addJobPosting = (jobposting) => {
        store.addJobPosting(jobposting);
    }
    const deleteJobPosting = (jobposting) => {
        store.deleteJobPosting(jobposting);
    }
    const saveJobPosting = (jobposting) => {
        store.saveJobPosting(jobposting);
    }

    return (
        <div>
            <h2>List of job postings</h2>
            {/* <input type='button' value='Filter' /> */}
            {
                jobpostings.map(e => <JobPosting key={e.id} item={e} onDelete={deleteJobPosting} onSave={saveJobPosting} />)
            }
            <JobPostingAddForm onAdd={addJobPosting} />
        </div>
    );
}

export default JobPostingList;