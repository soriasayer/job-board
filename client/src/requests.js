import {isLoggedIn, getAccessToken} from './auth';
import {ApolloClient, HttpLink, InMemoryCache, ApolloLink} from 'apollo-boost'
import gql from 'graphql-tag'

const endpointURL = 'http://localhost:9000/graphql'

const authLink = new ApolloLink((opration, forward) => {
  if(isLoggedIn()) {
    opration.setContext({
      headers: {
        'authorization': `Bearer ${getAccessToken()}`
      }
    })
  }
  return forward(opration)
})

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({uri: endpointURL})
  ]),
  cache: new InMemoryCache()
})

export const createJob = async(input) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput){
      job:createJob(input: $input){
        id
        title
        description
        company{
          id
          name
        }
      }
    }
  `
  const {data: {job}} = await client.mutate({mutation, variables: {input}})
  return job
}

export const loadCompany = async(id) => {
  const query = gql`
    query CompanyQuery($id: ID!){
      company(id: $id){
        id
        name
        description
        jobs{
          id
          title
        }
      }
    }
  `

  const {data: {company}} = await client.query({query, variables: {id}})
  return company
}

export const loadJob = async (id) => {
  const query = gql`
    query JobQuery($id: ID!){
      job(id: $id){
        id
        title
        company{
          id
          name
        }
        description
      }
    }
  `
  const {data: {job}} = await client.query({query, variables: {id}})
  return job
}

export const loadJobs = async () => {
  const query = gql`{
    jobs{
      id
      title
      company {
        id
        name
      }
    }
  }`

  const {data: {jobs}} = await client.query({query})
  return jobs
}