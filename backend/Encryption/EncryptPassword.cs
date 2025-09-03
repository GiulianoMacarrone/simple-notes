using System.Security.Cryptography;
using System.Text;

namespace backend.Encryption
{
    public static class EncryptPassword
    {
        public static string EncryptPww(string pPassword)
        {
            try
            {
                byte[] encrypted = Encoding.Unicode.GetBytes(pPassword);
                string _result = Convert.ToBase64String(encrypted);
                return _result;
            }
            catch (Exception ex) { throw; }
        }

        public static string DecryptPww(this string pCryptedPassword)
        {
            try
            {
                byte[] decrypt = Convert.FromBase64String(pCryptedPassword);
                string _result = Encoding.Unicode.GetString(decrypt);
                return _result;
            }
            catch (Exception ex) { throw; }
        }
    }

}
//ONLY FOR THIS DEMO PROJECT: The encryption would be SIMPLE and NOT SECURE, just to show an example of how to do it.