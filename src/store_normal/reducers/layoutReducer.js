import { OPEN, HALF_OPEN, OPEN_SMALL, CLOSE } from "./../actions/types";
import {_md_size, _lg_size} from './../../config/layoutSizes'


const handleCurrentLayoutState =()  => {
  console.log('from', 'handleCurrentLayoutState');
  
  if (window.innerWidth < _md_size) return { layoutState: CLOSE }
  if (window.innerWidth > _md_size && window.innerWidth < _lg_size) return { layoutState: HALF_OPEN }
  if (window.innerWidth > _lg_size) return { layoutState: OPEN }
}

const layoutReducer = (state = handleCurrentLayoutState(), action) => {
  switch (action.type) {
    case OPEN:
      return { ...state, layoutState: OPEN };
    case HALF_OPEN:
      return { ...state, layoutState: HALF_OPEN };
    case OPEN_SMALL:
      return { ...state, layoutState: OPEN_SMALL };
    case CLOSE:
      return { ...state, layoutState: CLOSE };
    default:
      return state;
  }
};

export default layoutReducer;
