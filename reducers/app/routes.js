// We only need to import the modules necessary for initial render
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import HomeRoutes from 'modules/home/homeRoutes'
import QuoteRoutes from 'modules/quote/quoteRoutes'
import PatientRoutes from 'modules/patient/routes'
//import UserRoutes from 'modules/user/userRoutes'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: HomeRoutes,
  childRoutes: [
    QuoteRoutes(store),
    PatientRoutes(store)
    //UserRoutes(store)
  ]
})


export default createRoutes