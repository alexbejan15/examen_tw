import { EventEmitter } from 'fbemitter'

const SERVER = 'http://localhost:8080';

class JobPostingStore {
    constructor() {
        this.data = [];
        this.emitter = new EventEmitter();
    }

    async getJobPostings() {
        try {
            const response = await fetch(`${SERVER}/jobpostings`);
            if (!response.ok) {
                throw response;
            }
            this.data = await response.json();
            this.emitter.emit('GET_JOBPOSTINGS_SUCCESS');
        } catch (err) {
            console.warn(err);
            this.emitter.emit('GET_JOBPOSTINGS_ERROR');
        }
    }

    async addJobPosting(jobposting) {
        try {
            const response = await fetch(`${SERVER}/jobpostings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobposting)
            })
            if (!response.ok) {
                throw response;
            }
            this.getJobPostings();
        } catch (err) {
            console.warn(err);
            this.emitter.emit('ADD_JOBPOSTINGS_ERROR');
        }
    }

    async saveJobPosting(id, jobposting) {
        try {
            const response = await fetch(`${SERVER}/jobpostings/${id}`, {
                method: 'PUT',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobposting)
            })
            if (!response.ok) {
                throw response;
            }
            this.getJobPostings();
        } catch (err) {
            console.warn(err);
            this.emitter.emit('UPDATE_JOBPOSTING_ERROR');
        }
    }

    async deleteJobPosting(id) {
        try {
            const response = await fetch(`${SERVER}/jobpostings/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw response;
            }
            this.getJobPostings();
        } catch (err) {
            console.warn(err);
            this.emitter.emit('DELETE_JOBPOSTING_ERROR');
        }
    }
}

const store = new JobPostingStore();

export default store;