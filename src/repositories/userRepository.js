const logger = require('../utilities/logger');
const { getSupabaseInstance } = require('../databases/supabase');

const saveEmailInPendingUsers = async (userObject) => {
    try {
        const supabase = getSupabaseInstance();
        const currentDate = new Date();
        const expireDate = new Date(currentDate.getTime() + 600_000);
        logger.info(`Inserting email ${userObject.email} to pending users`);
        const { data, error } = await supabase
            .from('email_verifications')
            .upsert({
                email: userObject.email,
                otp_hash: userObject.otp,
                password_hash: userObject.password,
                username: userObject.username,
                expires_at: expireDate,
                created_at: currentDate,
                last_sent_at: currentDate,
                attempt: 0
            }, {
                onConflict: ['email']
            })
            .select('id')
            .single();
        if (error) {
            logger.error(`Error in saving pending user data: ${error}`);
            throw new Error(error.message);
        }
        logger.info('Successfully saved email and OTP Hash');
        return data.id;
    } catch (error) {
        throw error;
    }
};

const reSaveOTP = async (email, otpHash) => {
    try {
        const supabase = getSupabaseInstance();
        const currentDate = new Date();
        const expireDate = new Date(currentDate.getTime() + 600_000);
        logger.info(`Inserting new otp to pending user`);
        const { error } = await supabase
            .from('email_verifications')
            .update({
                otp_hash: otpHash,
                expires_at: expireDate,
                created_at: currentDate,
                last_sent_at: currentDate,
                attempt: 0
            })
            .eq('email', email);
        if (error) {
            logger.error(`Error in saving otp in pending user data: ${error}`);
            throw new Error(error.message);
        }
        logger.info('Successfully saved OTP Hash');
        return email;
    } catch (error) {
        throw error;
    }
};


const verifyOtp = async ({ email, encryptedOTP }) => {
    try {
        const supabase = getSupabaseInstance();
        logger.info('Verifying encrypted otp');
        const { data, error } = await supabase
            .from('email_verifications')
            .select('email, password_hash, username')
            .eq('otp_hash', encryptedOTP)
            .eq('email', email)
            .gte('expires_at', new Date().toISOString())
            .maybeSingle();
        if (error) {
            logger.error(`Error in verifying OTP: ${error}`);
            throw new Error(error.message);
        }
        return data;
    } catch (error) {
        throw error;
    }
};

const getVerificationAttempts = async (email) => {
    try {
        const supabase = getSupabaseInstance();
        const { data, error } = await supabase
            .from('email_verifications')
            .select('attempt')
            .eq('email', email)
            .maybeSingle();
        if (error) {
            logger.error(`Error in getting verification attempts ${error}`);
            throw new Error(error.message)
        }
        return data;
    } catch (error) {
        throw error;
    }
};

const updateAttempts = async (email, attempt) => {
    try {
        const supabase = getSupabaseInstance();
        const { error } = await supabase
            .from('email_verifications')
            .update({
                attempt
            })
            .eq('email', email)
        if (error) {
            logger.error(`Error updating verification attempts ${error}`);
            throw new Error(error.message)
        }
        return;
    } catch (error) {
        throw error;
    }
};


const deletePendingUser = async (email) => {
    try {
        const supabase = getSupabaseInstance();
        const { error } = await supabase
            .from('email_verifications')
            .delete()
            .eq('email', email);
        if (error) {
            logger.error(`Error deleting verification attempts ${error}`);
            throw new Error(error.message)
        }
        return;
    } catch (error) {
        throw error;
    }
};


const saveUserData = async (user) => {
    try {
        const supabase = getSupabaseInstance();
        const { error } = await supabase
            .from('users')
            .insert({
                email: user.email,
                password_hash: user.password_hash,
                username: user.username,
                created_at: new Date()
            });
        if (error) {
            logger.error(`Error in saving email in users: ${error}`);
            throw new Error(error.message);
        }
        return user;
    } catch (error) {
        throw error;
    }


};

const loginUser = async (user) => {
    try {
        const supabase = getSupabaseInstance();
        const { data, error } = await supabase
            .from('users')
            .select('username,id')
            .eq('email', user.email)
            .eq('password_hash', user.password)
            .maybeSingle();
        if (error) {
            logger.error(`Error in saving user data: ${error}`);
            throw new Error(error.message);
        }
        return data;
    } catch (error) {
        throw error;
    }
};

const emailExist = async (email) => {
    try {
        const supabase = getSupabaseInstance();
        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('email', email)
            .maybeSingle();
        if (error) {
            logger.error(`Error in checking whether email already exist or not ${error}`);
            throw new Error(error.message);
        }
        return data
    } catch (error) {
        throw error;
    }
};

const getLastSentTime = async (email) => {
    try {
        const supabase = getSupabaseInstance();
        const { data, error } = await supabase
            .from('email_verifications')
            .select('last_sent_at')
            .eq('email', email)
            .maybeSingle();
        if (error) {
            logger.error(`Error in checking whether email already exist or not ${error}`);
            throw new Error(error.message);
        }
        return data
    } catch (error) {
        throw error;
    }
};

module.exports = {
    saveEmailInPendingUsers,
    reSaveOTP,
    verifyOtp,
    getVerificationAttempts,
    updateAttempts,
    deletePendingUser,
    saveUserData,
    loginUser,
    emailExist,
    getLastSentTime
}