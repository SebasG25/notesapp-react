import React, { Component } from 'react'
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class CreateNote extends Component {

    state = {
        users: [],
        userSelected: "",
        title: "",
        content: "",
        date: new Date(),
        editing: false,
        _id: ""
    }

    async componentDidMount() {
        const res = await axios.get('http://localhost:4000/api/users')
        this.setState({
            users: res.data.map(user => user.username),
            userSelected: res.data[0].username
        })
        if (this.props.match.params.id) {
            const res = await axios.get(`http://localhost:4000/api/notes/${this.props.match.params.id}`)
            this.setState({
                editing: true,
                _id: this.props.match.params.id,
                userSelected: res.data.author,
                title: res.data.title,
                content: res.data.content,
                date: new Date(res.data.date)
            })
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const newNote = {
            title: this.state.title,
            content: this.state.content,
            date: this.state.date,
            author: this.state.userSelected
        }

        if (this.state.editing) {
            await axios.put(`http://localhost:4000/api/notes/${this.state._id}`, newNote)
        } else {
            await axios.post('http://localhost:4000/api/notes', newNote)
        }
        this.props.history.push("/")
    }

    onInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onDateChange = (date) => {
        this.setState({ date })
    }


    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    <h4>Create a Note</h4>

                    {/* SELECT USER */}
                    <form>
                        <div className="form-group mb-2">
                            <select
                                name="userSelected"
                                className="form-control form-select form-select"
                                value={this.state.userSelected}
                                onChange={this.onInputChange}>
                                {
                                    this.state.users.map(user =>
                                        <option key={user} value={user}>
                                            {user}
                                        </option>)
                                }
                            </select>
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                name="title"
                                value={this.state.title}
                                onChange={this.onInputChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-2">
                            <textarea
                                name="content"
                                className="form-control"
                                placeholder="Content"
                                value={this.state.content}
                                onChange={this.onInputChange}
                                required>

                            </textarea>
                        </div>

                        <div className="form-group">
                            <DatePicker
                                className="form-control"
                                selected={this.state.date}
                                onChange={this.onDateChange}
                            />
                        </div>


                        <button type="submit" className="mt-2 btn btn-primary" onClick={this.onSubmit}>
                            Save
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}
