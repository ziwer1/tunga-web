import { createConfirmation } from 'react-confirm';
import ConfirmDialog from '../components/ConfirmDialog';

const confirm = createConfirmation(ConfirmDialog);

export default function(confirmation, options = {}) {
    return confirm({ confirmation, options });
}
