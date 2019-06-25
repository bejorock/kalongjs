import { LoopbackApplication } from '../dist/index'
import { MainModule } from './main.module';
import { LoopbackConnector } from '../src/connector';
//import { SampleControllerApi, UserControllerApi, UserController } from 'kalongjs-client-node';

const app = new LoopbackApplication(MainModule, LoopbackConnector)

app.setup().then(() => app.start())
/* .then(() => {
  try {
    const sampleApi = new SampleControllerApi('http://localhost:3000/api')

    return sampleApi.greet()
  } catch(e) {
    console.log(e)
  }
})
.then((data) => console.log(data.body))
.then(() => {
  const userApi = new UserControllerApi('http://localhost:3000/api')
  const model = new UserController()
  model.username = 'rana'
  model.email = 'rana@gmail.com'
  model.emailVerified = true
  model.realm = 'default'

  return userApi.create(model)
}) */
.then(() => app.loopbackContext.enableAuth())
.catch(err => console.log(err))