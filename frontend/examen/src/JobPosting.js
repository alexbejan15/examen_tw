import { useState } from 'react'
import store from './JobPostingStore';

function JobPosting(props) {
    const { item, onDelete, onSave } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [id, setId] = useState(item.id);
    const [description, setDescription] = useState(item.description);
    const [deadline, setDeadline] = useState(item.deadline);


    const deleteJobPosting = (evt) => {
        onDelete(item.id);
    }

    const saveJobPosting = (evt) => {
        onSave(item.id, {
            id,
            description,
            deadline
        });
        console.log(item);
        store.getJobPostings();
        setIsEditing(false);
    }

    const edit = () => {
        setIsEditing(true);
    }

    const cancel = () => {
        setIsEditing(false);
    }

    return (
        <div>
            {
                isEditing
                    ?
                    (
                        <>
                            <table>
                                <thead>
                                    <tr>

                                        <th>
                                            Id
                                        </th>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Deadline
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input type='number' value={id} onChange={(evt) => setId(evt.target.value)} />{item.id} </td>
                                        <td><input type='text' value={description} onChange={(evt) => setDescription(evt.target.value)} />{item.description} </td>
                                        <td><input type='date' value={deadline} onChange={(evt) => setDeadline(evt.target.value)} />{item.deadline} </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button onClick={saveJobPosting} >Save</button>
                                        </td>
                                        <td>
                                            <button onClick={cancel}>Cancel</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                        </>
                    )
                    : (
                        <>

                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Id
                                        </th>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Deadline
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{item.id}</td>
                                        <td>{item.description}</td>
                                        <td>{item.deadline}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button onClick={edit} >Edit</button>
                                        </td>
                                        <td>
                                            <button onClick={deleteJobPosting}>Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </>
                    )
            }
        </div>
    )

}

export default JobPosting;