import global from './global';
import home from './home';
import profile from './profile';
import contactUs from './contact';
import widgets from './widgets';
import support from './support';

export default {
    ...global,
    ...home,
    ...contactUs,
    ...widgets,
    ...profile,
    ...support,
}
