import vm from 'vm';
import vmContext from './context';

export const compileInVm = (jsString) => {
    const context = vm.createContext(vmContext);
    const vmFunction = vm.runInContext(jsString, context);
    return vmFunction;
};
