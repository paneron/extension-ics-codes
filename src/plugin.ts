import { makeRegistryExtension } from '@riboseinc/paneron-registry-kit';
import { itemClassConfiguration } from './registryConfig';


export default makeRegistryExtension({
  name: "ICS Codes Registry",
  itemClassConfiguration,
});
