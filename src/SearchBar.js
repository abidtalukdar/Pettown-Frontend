// import _ from 'lodash'
// import React, { Component } from 'react'
// import { Search, Grid, Segment, Header } from 'semantic-ui-react'

// const initialState = { isLoading: false, results: [], value: '' }

// const source = [
//     {
//       "title": "Grady - Konopelski",
//       "description": "Programmable object-oriented interface",
//       "image": "https://s3.amazonaws.com/uifaces/faces/twitter/YoungCutlass/128.jpg",
//       "price": "$68.18"
//     },
//     {
//       "title": "Barton, Cartwright and Boyer",
//       "description": "Mandatory 6th generation product",
//       "image": "https://s3.amazonaws.com/uifaces/faces/twitter/xtopherpaul/128.jpg",
//       "price": "$71.10"
//     },
//     {
//       "title": "Bednar - Bins",
//       "description": "Versatile bandwidth-monitored frame",
//       "image": "https://s3.amazonaws.com/uifaces/faces/twitter/karalek/128.jpg",
//       "price": "$42.78"
//     },
//     {
//       "title": "Jaskolski - Conroy",
//       "description": "Phased cohesive protocol",
//       "image": "https://s3.amazonaws.com/uifaces/faces/twitter/petar_prog/128.jpg",
//       "price": "$43.63"
//     },
//     {
//       "title": "Mohr, McGlynn and Mills",
//       "description": "Cross-platform incremental analyzer",
//       "image": "https://s3.amazonaws.com/uifaces/faces/twitter/naupintos/128.jpg",
//       "price": "$31.18"
//     }
//   ]

// export default class SearchBar extends Component {
//   state = initialState

//   handleResultSelect = (e, { result }) => this.setState({ value: result.title })

//   handleSearchChange = (e, { value }) => {
//     this.setState({ isLoading: true, value })

//     setTimeout(() => {
//       if (this.state.value.length < 1) return this.setState(initialState)

//       const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
//       const isMatch = (result) => re.test(result.username)

//       this.setState({
//         isLoading: false,
//         results: _.filter(this.props.users, isMatch),
//       })
//     }, 300)
//   }

//   render() {
//     const { isLoading, value, results } = this.state

//     return (
//       <Grid>
//         <Grid.Column width={6}>
//           <Search
//             loading={isLoading}
//             onResultSelect={this.handleResultSelect}
//             onSearchChange={_.debounce(this.handleSearchChange, 500, {
//               leading: true,
//             })}
//             results={results}
//             value={value}
//             {...this.props}
//           />
//         </Grid.Column>
//       </Grid>
//     )
//   }
// }
