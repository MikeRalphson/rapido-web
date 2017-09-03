import Backend from '../../adapter/Backend.js'
import Promise from 'bluebird';

export default class {

    static setVerified(verifiedStatus) {
      if(localStorage.getItem('userInfo')) {
        let userObject = JSON.parse(localStorage.getItem('userInfo'));
        userObject.isVerified = verifiedStatus;
        localStorage.setItem('userInfo', JSON.stringify(userObject));
      }else if( sessionStorage.getItem('userInfo')) {
        let userObject = JSON.parse(sessionStorage.getItem('userInfo'));
        userObject.isVerified = verifiedStatus;
        sessionStorage.setItem('userInfo', JSON.stringify(userObject));

      }
    }

    static storeUserInfo(userId, email, fullName, token, nickName, isVerified, rememberMe) {
      let userInfo = JSON.stringify({
        userId: userId,
        email: email,
        fullName: fullName,
        token: token,
        nickName: nickName,
        isVerified: isVerified
      });

      if( rememberMe ) {
        localStorage.setItem('userInfo', userInfo );
      }else {
        sessionStorage.setItem('userInfo', userInfo );
      }

      return userInfo;
    }

    static login(email, password, rememberMe) {
      return new Promise( (resolve, reject)=> {
        Backend.login({
          "email": email,
          "password": password
        })
        .then((result)=> {
          // Store the token based on the login parameters
          let userInfo = JSON.stringify({
            userId: result.userId,
            email: email,
            fullName: result.fullName,
            token: result.token,
            nickName: result.nickName,
            isVerified: result.isVerified
          });

          if( rememberMe ) {
            localStorage.setItem('userInfo', userInfo );
          }else {
            sessionStorage.setItem('userInfo', userInfo );
          }

          resolve(userInfo);
        })
        .catch((error)=> {
          //this.showAlert(error)
          reject(error);
        })
    });
  }

}
