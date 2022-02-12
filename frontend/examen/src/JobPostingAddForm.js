import { useState } from 'react'

function JobPostingAddForm(props) {
    const { onAdd } = props;
    const [id, setId] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    const add = (evt) => {
        onAdd({
            id,
            description,
            deadline
        });
    }

    return (
        <div>
            <h3> Add a job posting</h3>
            <div>
                <input type='number' placeholder='id' onChange={(evt) => setId(evt.target.value)} />
            </div>

            <div>
                <input type='text' placeholder='description' onChange={(evt) => setDescription(evt.target.value)} />
            </div>

            <div>
                <input type='date' placeholder='deadline' onChange={(evt) => setDeadline(evt.target.value)} />
            </div>

            <div>
                <input type='button' value='Add' onClick={add} />
            </div>
        </div>
    )
}

export default JobPostingAddForm;