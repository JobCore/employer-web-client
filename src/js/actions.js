import React from "react";
import { useHistory } from 'react-router-dom';
import Flux from "@4geeksacademy/react-flux-dash";
import { Session } from "bc-react-session";
import { Notify } from "bc-react-notifier";
import { Shift } from "./views/shifts.js";
import { Talent } from "./views/talents.js";
import { Rating } from "./views/ratings.js";
import { useNavigate } from "react-router-dom";
import { Invite } from "./views/invites.js";
import { Clockin, PayrollPeriod } from "./views/payroll.js";
import moment from "moment";
import { POST, GET, PUT, DELETE, PUTFiles } from "./utils/api_wrapper";
import log from "./utils/log";
import WEngine from "./utils/write_engine.js";
import qs from "query-string";
import { normalizeToSnakeCase } from "./utils/validation";
const Models = {
  shifts: Shift,
  ratings: Rating,
  "payroll-periods": PayrollPeriod,
  talents: Talent,
  employees: Talent,
};

export const autoLogin = (token = "") => {
  Session.destroy();

  return new Promise((resolve, reject) =>
    GET("profiles/me", null, { Authorization: "JWT " + token })
      .then(function (profile) {
        if (!profile.employer) {
          Notify.error(
            "Only employers are allowed to login into this application"
          );
          reject("Only employers are allowed to login into this application");
        } else if (!profile.status === "SUSPENDED") {
          Notify.error(
            "Your account seems to be innactive, contact support for any further details"
          );
          reject(
            "Your account seems to be innactive, contact support for any further details"
          );
        } else {
          const payload = {
            user: { ...profile.user, profile },
            access_token: token,
          };
          Session.start({ payload });
          resolve(payload);
        }
      })
      .catch(function (error) {
        reject(error.message || error);
        Notify.error(error.message || error);
        log.error(error);
      })
  );
};

export const login = (email, password, keep, history, id) => {
console.log("entrando a login#######")
console.log("history#######", history)
// console.log("data#######", data)
new Promise((resolve, reject) =>
    POST("login", {
      username_or_email: email,
      password: password,
      // employer_id: Number(id),
      exp_days: keep ? 30 : 1,
    })
      .then(function (data) { 
        // if (Number(data.user.profile.employer) != Number(id)) {

        //     let company = data.user.profile.other_employers.find(emp => emp.employer == Number(id) );

        //     updateCompanyUser({id: company.profile_id, employer: company.employer, employer_role: company.employer_role}, { 'Authorization': 'JWT ' + data.token });

        //     Session.start({
        //         payload: {
        //             user: data.user, access_token: data.token
        //         }
        //     });
        //     history.push('/');
        //     resolve();
        // }
        console.log("login data post###", data)
        if (!data.user.profile.employer) {
          Notify.error(
            "Only employers are allowed to login into this application"
          );
          reject("Only employers are allowed to login into this application");
        } else if (!data.user.profile.status === "SUSPENDED") {
          Notify.error(
            "Your account seems to be innactive, contact support for any further details"
          );
          reject(
            "Your account seems to be innactive, contact support for any further details"
          );
        } else {
          Session.start({
            payload: {
              user: data.user,
              access_token: data.token,
            },
          });
          if (!data.user.profile.employer.active_subscription)
            history.push("/subscribe");
          else history.push("/");
          resolve();
        }
      })
      .catch(function (error) {
        reject(error.message || error);
        Notify.error(error.message || error);
        log.error(error);
        
      })
  );
}


export const signup = (formData, history) =>
  new Promise((resolve, reject) =>
    POST("user/register", {
      email: formData.email,
      account_type: formData.account_type,
      employer_role: formData.employer_role || "",
      employer: formData.company || formData.employer,
      token: formData.token || "",
      username: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password,
      business_name: formData.business_name,
      business_website: formData.business_website,
      about_business: formData.about_business,
      phone: formData.phone,
    })
      .then(function (data) {
        Notify.success("You have signed up successfully, proceed to log in");
        history.push(`/login?type=${formData.account_type}`);
        resolve();
      })
      .catch(function (error) {
        reject(error.message || error);
        Notify.error(error.message || error);
        log.error(error);
      })
  );

export const remind = (email) =>
  new Promise((resolve, reject) =>
    POST("user/password/reset", {
      email: email,
    })
      .then(function (data) {
        resolve();
        Notify.success("Check your email!");
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        reject(error.message || error);
        log.error(error);
      })
  );
export const resetPassword = (formData, history) =>
  new Promise((resolve, reject) =>
    PUT("user/password/reset", {
      new_password: formData.new_password,
      repeat_password: formData.new_password,
      token: formData.token,
    })
      .then(function (data) {
        resolve();
        Notify.success(
          "You have change password successfully, proceed to log in"
        );
        history.push(`/login`);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        reject(error.message || error);
        log.error(error);
      })
  );

export const resendValidationLinkCurrent = (email, employer) =>
  new Promise((resolve, reject) =>
    POST("user/email/validate/send/" + email, {
      email: email,
    })
      .then(function (data) {
        resolve();
        Notify.success("We have sent you a validation link, check your email!");
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        reject(error.message || error);
        log.error(error);
      })
  );
export const resendValidationLink = (email, employer) =>
  new Promise((resolve, reject) =>
    POST("user/email/validate/send/" + email + "/" + employer, {
      email: email,
      employer: employer,
    })
      .then(function (data) {
        resolve();
        Notify.success("We have sent you a validation link, check your email!");
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        reject(error.message || error);
        log.error(error);
      })
  );

//Send company inviation to user
export const sendCompanyInvitation = (email, employer, employer_role, sender) =>
  new Promise((resolve, reject) =>
    POST(
      "user/email/company/send/" +
        email +
        "/" +
        sender +
        "/" +
        employer +
        "/" +
        employer_role,
      {
        email: email,
        sender: sender,
        employer: employer,
        employer_role: employer_role,
      }
    )
      .then(function (data) {
        //fisrt check if I have any of this on the store
        let entities = store.getState("jobcore-invites");
        if (!entities || !Array.isArray(entities)) entities = [];

        //if the response from the server is not a list
        if (!Array.isArray(data)) {
          // if the response is not a list, I will add the new object into that list
          Flux.dispatchEvent(
            "jobcore-invites",
            entities.concat([{ ...data, id: data.id }])
          );
        }
        //if it is an array
        else {
          const newShifts = data.map((inc) =>
            Object.assign({ ...data, id: inc.id })
          );
          Flux.dispatchEvent("jobcore-invites", entities.concat(newShifts));
        }
        resolve();
        Notify.success("We have sent the company invitation!");
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        reject(error.message || error);
        log.error(error);
      })
  );

export const logout = () => {
  setTimeout(() => {
    Session.destroy();
    store = new _Store();
  }, 3000);
};

/**
 * GENERIC ACTIONS, try to reuse them!!!!
 */

export const fetchAllIfNull = (entities) => {
  const _entities = entities.filter((e) => !store.getState("entity"));
  return fetchAll(_entities);
};
export const fetchAll = (entities) =>
  new Promise((resolve, reject) => {
    let requests = [];
    const checkPromiseResolution = () => {
      const hasPending = requests.find((r) => r.pending == true);
      if (!hasPending) {
        const hasError = requests.find((r) => r.error == true);
        if (hasError) reject();
        else resolve();
      }
    };

    entities.forEach((entity) => {
      const currentRequest = {
        entity: entity.slug || entity,
        pending: true,
        error: false,
      };
      requests.push(currentRequest);

      GET(entity.url || entity.slug || entity)
        .then(function (list) {
          if (typeof entity.callback == "function") entity.callback();
          Flux.dispatchEvent(entity.slug || entity, list);

          currentRequest.pending = false;
          checkPromiseResolution();
        })
        .catch(function (error) {
          Notify.error(error.message || error);
          log.error(error);

          currentRequest.pending = false;
          currentRequest.error = true;
          checkPromiseResolution();
        });
    });
  });

export const fetchAllMeIfNull = (entities) => {
  const _entities = entities.filter((e) => !store.getState("entity"));
  return fetchAllMe(_entities);
};
export const fetchAllMe = (entities) =>
  new Promise((resolve, reject) => {
    let requests = [];
    const checkPromiseResolution = () => {
      const hasPending = requests.find((r) => r.pending == true);
      if (!hasPending) {
        const hasError = requests.find((r) => r.error == true);
        if (hasError) reject();
        else resolve();
      }
    };

    entities.forEach((entity) => {
      const currentRequest = {
        entity: entity.slug || entity,
        pending: true,
        error: false,
      };
      requests.push(currentRequest);

      GET("employers/me/" + (entity.slug || entity))
        .then(function (list) {
          if (typeof entity.callback == "function") entity.callback();
          Flux.dispatchEvent(entity.slug || entity, list);

          currentRequest.pending = false;
          checkPromiseResolution();
        })
        .catch(function (error) {
          Notify.error(error.message || error);
          log.error(error);

          currentRequest.pending = false;
          currentRequest.error = true;
          checkPromiseResolution();
        });
    });
  });

export const fetchSingle = (entity, id) =>
  new Promise((resolve, reject) => {
    const _entity = entity.slug || entity;
    GET(entity.url || "employers/me/" + _entity + "/" + id)
      .then(function (data) {
        const cachedEntity = WEngine.get(_entity, id);
        if (cachedEntity) data = Object.assign(data, cachedEntity);
        Flux.dispatchEvent(
          _entity,
          store.replaceMerged(
            _entity,
            data.id,
            Models[_entity](data).defaults().unserialize()
          )
        );
        resolve(data);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject();
      });
  });

export const processPendingPayrollPeriods = () =>
  new Promise((resolve, reject) => {
    const payload = Session.getPayload();
    const params = {
      employer:
        payload.user.profile.employer.id || payload.user.profile.employer,
    };
    GET(`hook/generate_periods?${qs.stringify(params)}`)
      .then(function (_newPeriods) {
        let periods = store.getState("payroll-periods");
        Flux.dispatchEvent("payroll-periods", periods.concat(_newPeriods));
        resolve(_newPeriods);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject();
      });
  });

export const hook = (hookName) =>
  new Promise((resolve, reject) => {
    const payload = Session.getPayload();
    const params = {
      employer:
        payload.user.profile.employer.id || payload.user.profile.employer,
    };
    GET(`hook/${hookName}?${qs.stringify(params)}`)
      .then(function (data) {
        resolve(data);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject();
      });
  });

export const fetchTemporal = async (url, event_name, callback = null) => {
  try {
    const data = await GET(url);
    if (typeof callback == "function") callback();
    Flux.dispatchEvent(event_name, data);
    return data;
  } catch (error) {
    Notify.error(error.message || error);
    log.error(error);
    throw error;
  }
};

export const search = (entity, queryString = null) =>
  new Promise((accept, reject) =>
    GET(entity, queryString)
      .then(function (list) {
        console.log("list", list);
        if (typeof entity.callback == "function") entity.callback();
        Flux.dispatchEvent(entity.slug || entity, list);
        accept(list);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      })
  );
export const searchMe = (entity, queryString, mergeResults = false) =>
  new Promise((accept, reject) =>
    GET("employers/me/" + entity, queryString)
      .then(function (list) {
        if (typeof entity.callback == "function") entity.callback();
        if (mergeResults) {
          const previous = store.getState(entity.slug || entity);
          if (Array.isArray(previous))
            list = previous.concat(list.results || list);
        }
        Flux.dispatchEvent(entity.slug || entity, list);
        accept(list);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      })
  );

export const create = (entity, data, status = WEngine.modes.LIVE) =>
  new Promise((resolve, reject) => {
    POST("employers/me/" + (entity.url || entity), data)
      .then(function (incoming) {
        console.log("incoming", incoming);
        if (
          typeof entity.url === "string" &&
          typeof entity.slug === "undefined"
        )
          throw Error("Missing entity slug on the create method");

        //fisrt check if I have any of this on the store
        let entities = store.getState(entity.slug || entity);
        if (!entities || !Array.isArray(entities)) entities = [];

        //if the response from the server is not a list
        if (!Array.isArray(incoming)) {
          // if the response is not a list, I will add the new object into that list
          Flux.dispatchEvent(
            entity.slug || entity,
            entities.concat([{ ...data, id: incoming.id }])
          );
        }
        //if it is an array
        else {
          var newShifts;
          if (entity === "shifts" && incoming.length > 1) {
            newShifts = incoming;
          } else {
            newShifts = incoming.map((inc) =>
              Object.assign({ ...data, id: inc.id })
            );
          }
          console.log("slug", entity.slug);
          console.log("entity", entity);
          console.log("entities", entities);
          console.log("newShifts", newShifts);
          Flux.dispatchEvent(entity.slug || entity, entities.concat(newShifts));
        }
        Notify.success(
          "The " +
            (entity.slug || entity).substring(
              0,
              (entity.slug || entity).length - 1
            ) +
            " was created successfully"
        );
        resolve(incoming);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      });
  });

export const update = (entity, data, mode = WEngine.modes.LIVE) =>
  new Promise((resolve, reject) => {
    let path =
      typeof entity == "string"
        ? `employers/me/${entity}/${data.id}`
        : entity.path + (typeof data.id !== "undefined" ? `/${data.id}` : "");
    const event_name = typeof entity == "string" ? entity : entity.event_name;
    if (mode === WEngine.modes.POSPONED) path += "?posponed=true";
    PUT(path, data)
      .then(function (incomingObject) {
        if (mode === WEngine.modes.POSPONED) {
          if (event_name === "shifts")
            data = Shift(incomingObject).defaults().unserialize();
          WEngine.add({ entity: event_name, method: "PUT", data, id: data.id });
        } else if (entity == "payrates") data = incomingObject;
        else if (event_name === "current_employer")
          Notify.success(
            "The " + "payroll settings" + " was updated successfully"
          );
        else Notify.success("The " + event_name + " was updated successfully");
        let entities = store.replaceMerged(event_name, data.id, data);
        Flux.dispatchEvent(event_name, entities);
        resolve(data);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      });
  });

export const remove = (entity, data) => {
  const path =
    typeof entity == "string"
      ? `employers/me/${entity}/${data.id}`
      : `${entity.path}/${data.id}`;
  const event_name = typeof entity == "string" ? entity : entity.event_name;
  DELETE(path)
    .then(function (incomingObject) {
      let entities = store.remove(event_name, data.id);
      Flux.dispatchEvent(event_name, entities);

      const name = path.split("/");
      Notify.success(
        "The " +
          name[0].substring(0, name[0].length - 1) +
          " was deleted successfully"
      );
    })
    .catch(function (error) {
      Notify.error(error.message || error);
      log.error(error);
    });
};

/**
 * From here on the actions are not generic anymore
 */

export const updateProfileImage = (file) =>
  PUTFiles("employers/me/image", [file])
    .then(function (incomingObject) {
      const payload = Session.getPayload();

      const user = Object.assign(payload.user, { profile: incomingObject });
      // Session.setPayload({ user });
      return user.profile.picture;
    })
    .catch(function (error) {
      Notify.error(error.message || error);
      log.error(error);
    });

export const updateProfile = (data) => {
  PUT(`profiles/${data.id}`, data)
    .then(function (incomingObject) {
      const payload = Session.getPayload();
      const user = Object.assign(payload.user, { profile: incomingObject });
      Session.setPayload({ user });
    })
    .catch(function (error) {
      Notify.error(error.message || error);
      log.error(error);
    });
};
export const updateProfileMe = (data) => {
  PUT(`profiles/me`, data)
    .then(function (incomingObject) {
      const payload = Session.getPayload();
      const user = Object.assign(payload.user, { profile: incomingObject });
      Session.setPayload({ user });
    })
    .catch(function (error) {
      Notify.error(error.message || error);
      log.error(error);
    });
};

export const createSubscription = (data, history) => {
  console.log("entrando a createSubscription#######")
  
  console.log("data#######", data)
  
  console.log("history#######", history)
  const employer = store.getState("current_employer");
  
    POST(`employers/me/subscription`, data)
      .then(function (active_subscription) {
        
        Flux.dispatchEvent("current_employer", {
          ...employer,
          active_subscription,
        });
        Notify.success("The subscription was created successfully");
        
       
      }).then(
        setTimeout(() => {history.push("/home")}, 5000)
        
        )
      .catch(function (error) {
        console.log("ERROR", error);
        Notify.error(error.message || error);
        log.error(error);
      })
  
};


export const updateSubscription = (data, history) => {
  const employer = store.getState("current_employer");
  PUT(`employers/me/subscription`, data)
    .then(function (active_subscription) {
      Flux.dispatchEvent("current_employer", {
        ...employer,
        active_subscription,
      });
      Notify.success("The subscription was updated successfully");
    })
    .catch(function (error) {
      Notify.error(error.message || error);
      log.error(error);
    });
};

export const removeBankAccount = (route, data) => {
  const path = `${route}/${data.id}`;
  DELETE(path)
    .then(() => {
      Notify.success("The " + data.name + " was deleted successfully");
      searchBankAccounts();
    })
    .catch((error) => {
      console.log("bank-accounts error: ", error);
      Notify.error(error.message || error);
      log.error(error);
    });
};

export const rejectCandidate = async (shiftId, applicant) => {
  let shift = store.get("shifts", shiftId);
  if (!shift) shift = await fetchSingle("shifts", shiftId);
  if (shift) {
    const newCandidates = shift.candidates.filter(
      (candidate) => candidate.id != applicant.id
    );
    const updatedShift = {
      candidates: newCandidates.map((cand) => cand.id),
    };

    try {
      await PUT(`employers/me/shifts/${shiftId}/candidates`, updatedShift);

      Flux.dispatchEvent(
        "shifts",
        store.replaceMerged("shifts", shiftId, {
          candidates: newCandidates,
        })
      );

      const applications = store.getState("applications");
      if (applications)
        Flux.dispatchEvent(
          "applications",
          store.filter(
            "applications",
            (item) =>
              item.shift.id != shiftId || item.employee.id != applicant.id
          )
        );

      Notify.success("The candidate was successfully rejected");
      return { ...shift, candidates: newCandidates };
    } catch (error) {
      Notify.error(error.message || error);
      log.error(error);
      throw error;
    }
  } else {
    Notify.error("Shift not found");
    throw new Error("Shift not found");
  }
};

export const updateCompanyUser = (user, header = {}) =>
  new Promise((resolve, reject) => {
    PUT(`employers/me/users/${user.id}`, user, header)
      .then((resp) => {
        const users = store.getState("users");

        if (users) {
          let _users = users.map((u) => {
            if (u.email == resp.email) return resp;
            else return u;
          });

          Flux.dispatchEvent("users", _users);
        }

        resolve(resp);
      })
      .catch((error) => {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      });
  });
export const updateUser = (user, header = {}) =>
  new Promise((resolve, reject) => {
    PUT(`employers/me/users/${user.id}`, user, header)
      .then((resp) => {
        const users = store.getState("users");

        if (users) {
          let _users = users.map((u) => {
            if (u.email == resp.email) return resp;
            else return u;
          });

          Flux.dispatchEvent("users", _users);
        }

        Notify.success("The user was successfully updated");
        resolve(resp);
      })
      .catch((error) => {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      });
  });

export const removeUser = (user) =>
  new Promise((resolve, reject) => {
    DELETE(`employers/me/users/${user.profile.id}`)
      .then((resp) => {
        Flux.dispatchEvent(
          "users",
          store.getState("users").filter((u) => u.email != user.email)
        );

        Notify.success("The user was successfully updated");
        resolve(resp);
      })
      .catch((error) => {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      });
  });

export const deleteShiftEmployee = async (shiftId, employee) => {
  let shift = store.get("shifts", shiftId);
  if (!shift) shift = await fetchSingle("shifts", shiftId);
  if (shift) {
    const newEmployees = shift.employees.filter((emp) => emp.id != employee.id);
    const updatedShift = {
      employees: newEmployees.map((emp) => emp.id),
    };
    PUT(`employers/me/shifts/${shiftId}/employees`, updatedShift)
      .then(() => {
        Flux.dispatchEvent(
          "shifts",
          store.replaceMerged("shifts", shiftId, {
            employees: newEmployees,
          })
        );

        Notify.success("The employee was successfully deleted");
      })
      .catch((error) => {
        Notify.error(error.message || error);
        log.error(error);
      });
  } else Notify.error("Shift not found");
};

export const acceptCandidate = async (shiftId, applicant) => {
  let shift = store.get("shifts", shiftId);
  if (!shift) shift = await fetchSingle("shifts", shiftId);
  if (shift) {
    if (
      shift.status === "OPEN" ||
      shift.employees.length < shift.maximum_allowed_employees
    ) {
      const newEmployees = shift.employees.concat([applicant]);
      const newCandidates = shift.candidates.filter((c) =>
        Number.isInteger(c) ? c !== applicant.id : c.id !== applicant.id
      );
      const shiftData = {
        employees: newEmployees.map((emp) =>
          Number.isInteger(emp) ? emp : emp.id
        ),
        candidates: newCandidates.map((can) =>
          Number.isInteger(can) ? can : can.id
        ),
      };

      try {
        const data = await PUT(
          `employers/me/shifts/${shiftId}/candidates`,
          shiftData
        );

        const applications = store.getState("applications");
        if (applications)
          Flux.dispatchEvent(
            "applications",
            store.filter(
              "applications",
              (item) =>
                item.shift.id != shiftId || item.employee.id != applicant.id
            )
          );
        Flux.dispatchEvent(
          "shifts",
          store.replaceMerged("shifts", shiftId, {
            employees: newEmployees,
            candidates: newCandidates,
          })
        );
        Notify.success("The candidate was successfully accepted");
        return null;
      } catch (error) {
        Notify.error(error.message || error);
        log.error(error);
        throw error;
      }
    } else {
      Notify.error("This shift is already filled.");
      throw new Error("This shift is already filled.");
    }
  } else {
    Notify.error("Shift not found");
    throw new Error("Shift not found");
  }
};

export const updateTalentList = (action, employee, listId) => {
  const favoriteList = store.get("favlists", listId);

  return new Promise((resolve, reject) => {
    if (favoriteList) {
      let employeeIdsArr = favoriteList.employees.map(
        (employee) => employee.id || employee
      );
      if (action === "add") {
        employeeIdsArr.push(employee.id || employee);
      } else if (action === "delete") {
        employeeIdsArr = employeeIdsArr.filter(
          (id) => id != (employee.id || employee)
        );
      }
      PUT("employers/me/favlists/" + listId, { employees: employeeIdsArr })
        .then((updatedFavlist) => {
          Flux.dispatchEvent(
            "favlists",
            store.replaceMerged("favlists", listId, {
              employees: updatedFavlist.employees,
            })
          );
          Notify.success(
            `The talent was successfully ${
              action == "add" ? "added" : "removed"
            }`
          );
          resolve(updatedFavlist);
        })
        .catch((error) => {
          Notify.error(error.message || error);
          log.error(error);
          reject(error);
        });
    } else {
      Notify.error("Favorite list not found");
      reject();
    }
  });
};

export const updatePayments = async (payments, period) => {
  if (!Array.isArray(payments)) payments = [payments];
  for (let i = 0; i < payments.length; i++) {
    let data = { ...payments[i] };
    if (data.shift) data.shift = data.shift.id || data.shift;
    if (data.employer) data.employer = data.employer.id || data.employer;
    if (data.employee) data.employee = data.employee.id || data.employee;
    if (data.clockin) data.clockin = data.clockin.id || data.clockin;

    const _updated = await update("payment", data);
    period = {
      ...period,
      payments: period.payments.map((p) => {
        if (p.id === _updated.id) return { ...p, ...payments[i] };
        else return p;
      }),
    };
  }

  Flux.dispatchEvent(
    "payroll-periods",
    store.replace("payroll-periods", period.id, period)
  );
  return period;
};

export const createPayment = async (payment, period) => {
  const _new = await create("payment", {
    ...payment,
    employee: payment.employee.id || payment.employee,
    shift: payment.shift.id || payment.shift,
  });
  const _period = {
    ...period,
    payments: period.payments.concat([
      { ..._new, employee: payment.employee, shift: payment.shift },
    ]),
  };

  Flux.dispatchEvent(
    "payroll-periods",
    store.replace("payroll-periods", period.id, _period)
  );
  return period;
};

/**
 * Make employee payment
 * @param  {string}  employeePaymentId employee payment id
 * @param  {string}  paymentType payment type could be: CHECK, FAKE or ELECTRONIC TRANSFERENCE
 * @param  {string}  employer_bank_account_id employer bank account id
 * @param  {string}  employee_bank_account_id employee bank account id
 */
export const makeEmployeePayment = (
  employeePaymentId,
  paymentType,
  employer_bank_account_id,
  employee_bank_account_id,
  deductions_list,
  deductions
) =>
  new Promise((resolve, reject) => {
    const data = {
      payment_type: paymentType,
      payment_data:
        paymentType === "CHECK"
          ? {}
          : {
              employer_bank_account_id: employer_bank_account_id,
              employee_bank_account_id: employee_bank_account_id,
            },
      deductions_list: deductions_list,
      deductions: deductions,
    };

    POST(`employers/me/employee-payment/${employeePaymentId}`, data)
      .then((resp) => {
        Flux.dispatchEvent("employee-payment", resp);
        Notify.success("Payment was successful");
        resolve(resp);
      })
      .catch((error) => {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      });
  });

/**
 * Fetch payroll period payments
 * @param  {string}  payrollPeriodId employee payment id
 */
export const fetchPeyrollPeriodPayments = async (payrollPeriodId) => {
  try {
    const response = await GET(
      `employers/me/employee-payment-list/${payrollPeriodId}`
    );
    Flux.dispatchEvent("payroll-period-payments", response);
  } catch (error) {
    Notify.error(error.message || error);
  }
};

export const addBankAccount = (token, metadata) =>
  new Promise((resolve, reject) =>
    POST(
      "bank-accounts/",
      normalizeToSnakeCase({
        publicToken: token,
        institutionName: metadata.institution.name,
      })
    )
      .then(function (data) {
        console.log("addBankAccount data: ", data);
        resolve();
        searchBankAccounts();
      })
      .catch(function (error) {
        reject(error.message || error);
        Notify.error(error.message || error);
        log.error(error);
      })
  );

export const searchBankAccounts = () =>
  new Promise((accept, reject) =>
    GET("bank-accounts/")
      .then(function (list) {
        console.log("bank-accounts list: ", list);
        Flux.dispatchEvent("bank-accounts", list);
        accept(list);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      })
  );

/**
 * Get payments report
 * @param  {string}  periodId payroll period id
 * @param  {string}  startDate start date
 * @param  {string}  endDate end date
 */
export const getPaymentsReport = (periodId, startDate, endDate) =>
  new Promise((accept, reject) => {
    const route = `employers/me/employee-payment/report?start_date=${startDate}&end_date=${endDate}&period_id=${periodId}`;
    GET(route)
      .then(function (list) {
        Flux.dispatchEvent("payments-reports", list);
        accept(list);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      });
  });

/**
 * Get deductions report
 * @param  {string}  periodId payroll period id
 * @param  {string}  startDate start date
 * @param  {string}  endDate end date
 */
export const getDeductionsReport = (periodId, startDate, endDate) =>
  new Promise((accept, reject) => {
    const route = `employers/me/employee-payment/deduction-report?start_date=${startDate}&end_date=${endDate}&period_id=${periodId}`;
    GET(route)
      .then(function (list) {
        Flux.dispatchEvent("deductions-reports", list);
        accept(list);
      })
      .catch(function (error) {
        Notify.error(error.message || error);
        log.error(error);
        reject(error);
      });
  });

// export const createPayrollPeriodRating = (entity, queryString) => new Promise((accept, reject) =>
//     GET('employers/me/' + entity, queryString)
//         .then(function (list) {
//             if (typeof entity.callback == 'function') entity.callback();
//             Flux.dispatchEvent(entity.slug || entity, list);
//             accept(list);
//         })
//         .catch(function (error) {
//             Notify.error(error.message || error);
//             log.error(error);
//             reject(error);
//         })
// );

export const http = { GET };

class _Store extends Flux.DashStore {
  constructor() {
    super();
    this.addEvent("positions");
    this.addEvent("venues");
    this.addEvent("onboarding");
    this.addEvent("users");
    this.addEvent("invites", (invites) => {
      if (!Array.isArray(invites)) return [];
      return invites.map((inv) => Invite(inv).defaults().unserialize());
    });
    this.addEvent("payment");
    this.addEvent("employee-payment");
    this.addEvent("clockins", (clockins) =>
      !Array.isArray(clockins)
        ? []
        : clockins.map((c) => ({
            ...c,
            started_at: moment(c.starting_at),
            ended_at: moment(c.ended_at),
          }))
    );
    this.addEvent("jobcore-invites");
    this.addEvent("ratings", (_ratings) =>
      !Array.isArray(_ratings)
        ? []
        : _ratings.map((ra) => Rating(ra).defaults().unserialize())
    );
    this.addEvent("bank-accounts");
    this.addEvent("employees", (employees) => {
      if (!Array.isArray(employees)) return [];
      return employees
        .filter((em) => em.user.profile)
        .map((tal) => Talent(tal).defaults().unserialize());
    });
    this.addEvent("favlists");
    this.addEvent("company-user");
    this.addEvent("deduction");
    this.addEvent("payrates");
    this.addEvent("payroll-period-payments");
    this.addEvent("payments-reports");
    this.addEvent("deductions-reports");
    this.addEvent("badges");

    this.addEvent("applications", (applicants) => {
      return !applicants ||
        (Object.keys(applicants).length === 0 &&
          applicants.constructor === Object)
        ? []
        : applicants.map((app) => {
            app.shift = Shift(app.shift).defaults().unserialize();
            return app;
          });
    });
    this.addEvent("shifts", (shifts) => {
      shifts = Array.isArray(shifts.results)
        ? shifts.results
        : Array.isArray(shifts)
        ? shifts
        : null;
      let newShifts =
        !shifts ||
        (Object.keys(shifts).length === 0 && shifts.constructor === Object)
          ? []
          : shifts
              .filter((s) => s.status !== "CANCELLED")
              .map((shift) => {
                //already transformed
                return Shift(shift).defaults().unserialize();
              });

      const applicants = this.getState("applications");
      if (!applicants && Session.get().isValid) fetchAllMe(["applications"]);

      // const _shift = newShifts.find(s => s.id == 1095);
      return newShifts;
    });

    // Payroll related data
    // this.addEvent('payroll-periods', (period) => {
    //     return (!period || (Object.keys(period).length === 0 && period.constructor === Object)) ? [{ label: "Loading payment periods...", value: null }] : period.map(p => {
    //         p.label = `From ${moment(p.starting_at).format('MM-D-YY h:mm A')} to ${moment(p.ending_at).format('MM-D-YY h:mm A')}`;
    //         if(!Array.isArray(p.payments)) p.payments = [];
    //         return p;
    //     });
    // });
    this.addEvent("payroll-periods");
    this.addEvent("subscription");
    this.addEvent("w4-form");
    this.addEvent("previos-employee-shifts");
    this.addEvent("employee-expired-shifts"); //temporal, just used on the payroll report

    //temporal storage (for temporal views, information that is read only)
    this.addEvent("current_employer", (employer) => {
      employer.payroll_configured =
        employer.payroll_period_starting_time != null;
      employer.payroll_period_starting_time = moment.isMoment(
        employer.payroll_period_starting_time
      )
        ? employer.payroll_period_starting_time
        : employer.payroll_period_starting_time
        ? moment(employer.payroll_period_starting_time)
        : moment(employer.created_at).startOf("isoWeek");
      return employer;
    });
    this.addEvent("single_payroll_detail", (payroll) => {
      const clockins = payroll.clockins;
      let approved = true;
      let paid = true;
      payroll.clockins =
        !clockins ||
        (Object.keys(clockins).length === 0 && clockins.constructor === Object)
          ? []
          : clockins.map((clockin) => {
              //already transformed
              if (clockin.status == "PENDING") {
                approved = false;
                paid = false;
              } else if (clockin.status != "PAID") paid = false;

              return Clockin(clockin).defaults().unserialize();
            });

      if (typeof payroll.talent != "undefined")
        payroll.talent.paymentsApproved = approved;
      if (typeof payroll.talent != "undefined")
        payroll.talent.paymentsPaid = paid;
      payroll.approved = approved;
      payroll.paid = paid;
      return payroll;
    });
  }

  get(type, id) {
    const entities = this.getState(type);
    if (entities)
      return entities.find(
        (ent) => ent.id == parseInt(id, 10) || ent.value == parseInt(id, 10)
      );
    else return null;
  }
  add(type, item) {
    const entities = this.getState(type);
    if (item) return entities.concat([item]);
    //else return entities;
    else throw new Error("Trying to add a null item into " + type);
  }
  replace(type, id, item) {
    const entities = this.getState(type);
    if (!entities) throw new Error("No item found in " + type);

    if (Array.isArray(entities)) {
      return entities.concat([]).map((ent) => {
        if (ent.id != parseInt(id, 10)) return ent;
        return item;
      });
    } else return item;
  }
  replaceMerged(type, id, item) {
    let entities = this.getState(type);
    if (!entities) entities = [];

    if (Array.isArray(entities)) {
      const result = entities.concat([]).map((ent) => {
        if (ent.id != parseInt(id, 10)) return ent;
        return Object.assign(ent, item);
      });
      return result;
    } else {
      return Object.assign(entities, item);
    }
  }
  remove(type, id) {
    const entities = this.getState(type);
    if (entities)
      return entities.filter((ent) => {
        return ent.id != parseInt(id, 10);
      });
    else throw new Error("No items found in " + entities);
  }

  filter(type, callback) {
    const entities = this.getState(type);
    if (entities) return entities.filter(callback);
    else throw new Error("No items found in entity type: " + type);
  }
}
export let store = new _Store();
