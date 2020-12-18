import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Grid,
  Header,
  Input,
  Image,
  Loader, Card, Segment, Container
} from 'semantic-ui-react'

import { createSuperHero, deleteSuperHero, getSuperHeros } from '../api/superhero-api'
import Auth from '../auth/Auth'
import { SuperHero } from '../types/SuperHero'

interface SuperHeroesProps {
  auth: Auth,
  history: History
}

interface SuperHeroesState {
  superheroes: SuperHero[],
  newSuperHeroName: string,
  newSuperHeroDesc: string,
  loadingSuperHeroes: boolean
}

export class SuperHeroes extends React.PureComponent<SuperHeroesProps, SuperHeroesState> {
  state: SuperHeroesState = {
    superheroes: [],
    newSuperHeroName: '',
    newSuperHeroDesc: '',
    loadingSuperHeroes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSuperHeroName: event.target.value })
  }

  handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSuperHeroDesc: event.target.value })
  }

  onEditButtonClick = (superheroId: string) => {
    this.props.history.push(`/superhero/${superheroId}/edit`)
  }

  onSuperHeroCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const newSuperHero = await createSuperHero(this.props.auth.getIdToken(), {
        name: this.state.newSuperHeroName,
        desc: this.state.newSuperHeroDesc
      })
      this.setState({
        superheroes: [...this.state.superheroes, newSuperHero],
        newSuperHeroName: '',
        newSuperHeroDesc: ''
      })
    } catch {
      alert('SuperHero creation failed')
    }
  }

  onSuperHeroDelete = async (superheroId: string) => {
    try {
      await deleteSuperHero(this.props.auth.getIdToken(), superheroId)
      this.setState({
        superheroes: this.state.superheroes.filter(superhero => superhero.superheroId != superheroId)
      })
    } catch {
      alert('SuperHero deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const superheroes = await getSuperHeros(this.props.auth.getIdToken())
      this.setState({
        superheroes,
        // newSuperHeroName: '', newSuperHeroDesc: '',
        loadingSuperHeroes: false
      })
    } catch (e) {
      alert(`Failed to fetch superheroes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1" textAlign='center'>Super Heroes</Header>

        {this.renderCreateSuperHeroInput()}

        {this.renderSuperHeros()}
      </div>
    )
  }

  renderCreateSuperHeroInput() {
    return (
      <Container>
        <Header>Create</Header>
        <Segment.Group>
          <Segment>
            <Input
              fluid
              actionPosition="left"
              placeholder="Enter name"
              onChange={this.handleNameChange}
            />
          </Segment>

          <Segment>
            <Input
              fluid
              placeholder="Enter description"
              onChange={this.handleDescChange}
            />
          </Segment>

          <Segment>
            <Button onClick={this.onSuperHeroCreate} primary>
              Create
            </Button>
          </Segment>
        </Segment.Group>
      </Container>
    )
  }

  renderSuperHeros() {
    if (this.state.loadingSuperHeroes) {
      return this.renderLoading()
    }

    return this.renderSuperHerosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Super heroes
        </Loader>
      </Grid.Row>
    )
  }

  renderSuperHerosList() {
    return (
      <Card.Group centered={true}  style={{ padding: '2rem' }}>
        {this.state.superheroes.map((superhero, pos) => {
          return (
            <Card key={superhero.superheroId}>
              <Card.Content>
                {superhero.attachmentUrl && (
                  <Image src={superhero.attachmentUrl} fontSize={42} _size="small" wrapped />
                )}

                {!superhero.attachmentUrl && (
                  <Image src="https://via.placeholder.com/150" wrapped />
                )}

                <Card.Header style={{ padding: '0.5rem 0' }}>{superhero.name}</Card.Header>
                <Card.Description>{superhero.desc}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                  <Button primary onClick={() => this.onEditButtonClick(superhero.superheroId)}>
                    Update
                  </Button>
                  <Button color='red' onClick={() => this.onSuperHeroDelete(superhero.superheroId)}>
                    Delete
                  </Button>
              </Card.Content>
            </Card>
          )
        })}
      </Card.Group>
    )
  }

}
