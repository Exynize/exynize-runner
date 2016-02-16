import logger from '../logger';
import m from 'module';
import vm from 'vm';
import vmContext from './context';

export const compileInVm = (jsString) => {
    logger.debug('compiling function...', jsString);
    const context = vm.createContext(vmContext);
    const vmFunction = {};
    vm.runInContext(m.wrap(jsString), context)(vmFunction, require);
    return vmFunction;
};
