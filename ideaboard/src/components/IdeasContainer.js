import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'
import Idea from './Idea'
import IdeaForm from './IdeaForm'

class IdeasContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideas: [],
      editingIdeaId: null
    }
  }

  componentDidMount() {
    axios.get('http://78.155.206.30:3005/api/v1/ideas.json')
    .then(response => {
      console.log(response)
      this.setState({ideas: response.data})
    })
    .catch(error => console.log(error))
  }

  addNewIdea = () => {
    axios.post(
      'http://78.155.206.30:3005/api/v1/ideas',
      { idea:
        {
          title: '',
          body: ''
        }
      }
    )
    .then(response => {
      const ideas = update(this.state.ideas, {
        $splice: [[0, 0, response.data]]
      })
      this.setState({
        ideas: ideas,
        editingIdeaId: response.data.id
      })
    })
    .catch(error => console.log(error))
  }

  updateIdea = (idea) => {
    const ideaIndex = this.state.ideas.findIndex(x => x.id === idea.id)
    const ideas = update(this.state.ideas, {
      [ideaIndex]: { $set: idea }
    })
    this.setState({ideas: ideas})
  }

  render() {
    return (
      <div>
        {this.state.ideas.map((idea) => {
          if(this.state.editingIdeaId == idea.id) {
            return(<IdeaForm idea={idea} key={idea.id} updateIdea={this.updateIdea} />)
          } else {
            return (<Idea idea={idea} key={idea.id} />)
          }
        })}
        <button className="newIdeaButton"
          onClick={this.addNewIdea} >
          New Idea
        </button>
      </div>
    );
  }
}

export default IdeasContainer
