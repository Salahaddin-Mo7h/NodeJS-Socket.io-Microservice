import { HelloWorld } from "./../controllers/HelloController";

export const Routes = app => {
  app.get("/health", HelloWorld);
};

export default Routes;
