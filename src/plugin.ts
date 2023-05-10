import { makeExtension } from '@riboseinc/paneron-extension-kit';

export default makeExtension({
  mainView: () => import('./RepoView'),
  name: "ICS Codes Registry",
  requiredHostAppVersion: "^2.0.0",
  datasetMigrations: {},
  datasetInitializer: () => import('./migrations/initial'),
});
