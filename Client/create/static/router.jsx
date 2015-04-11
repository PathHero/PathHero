// This can be dropped in to enable the react router
// by disabling the React.render all in app.jsx

// var Router = ReactRouter;

// var DefaultRoute = Router.DefaultRoute;
// var Link = Router.Link;
// var Route = Router.Route;
// var RouteHandler = Router.RouteHandler;

// var App = React.createClass({
//   render: function () {
//     return (
//       <div>
//         <header>
//           <ul>
//             <li><Link to="create">Create hunt</Link></li>
//           </ul>
//           Logged in as Jane
//         </header>

//         {/* this is the important part */}
//         <RouteHandler/>
//       </div>
//     );
//   }
// });

// var routes = (
//   <Route name="app" path="/" handler={App}>
//     <Route name="create" handler={HuntBox}/>
//     <DefaultRoute handler={App} />
//   </Route>
// );

// Router.run(routes, function (Handler) {
//   React.render(<Handler/>, document.getElementById('app-container'));
// });