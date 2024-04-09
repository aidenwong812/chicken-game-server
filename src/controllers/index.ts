import express from 'express';
import accountsRoutes from './accounts';
import adminRoutes from './admin';
import groupsRoutes from './groups';
import membershipRoutes from './membership';
import settingsRoutes from './settings';
import transferRoutes from './transfer';

const router = express.Router();

router.use('/accounts', accountsRoutes);
router.use('/admin', adminRoutes);
router.use('/groups', groupsRoutes);
router.use('/membership', membershipRoutes);
router.use('/settings', settingsRoutes);
router.use('/transfer', transferRoutes);

export default router;
