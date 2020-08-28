import './style.scss';
import React from "react";
import PropTypes from 'prop-types';
import Avatar from '../avatar';
import Stars from '../stars';
/**
 * Applican Card
 */
const EmployeeExtendedCard = (props) => {

    const positions =  !props.positions ? null : props.employee.positions.slice(0, 4).map((p, i) => {
        return props.positions.find(pos => p == pos.value || p.id == pos.value);
    });


    const badgesHTML = !props.employee.badges ? [] : props.employee.badges.map((b, i) => (<span key={i} className="badge">{b.title}</span>));
    const favoriteCount = !Array.isArray(props.employee.favoritelist_set) ? 0 :props.employee.favoritelist_set.length;
    return (<li className={`aplicantcard ${props.hoverEffect ? "aplicantcard-hover":""} ${props.showButtonsOnHover ? "show-hover":""} ${props.className}`} onClick={() => (props.onClick) ? props.onClick() : false}>

        <Avatar url={props.employee.user.profile.picture} />
        <div className="row">
            <div className="col">
                <a href="#"><b>{props.employee.user.first_name + ' ' + props.employee.user.last_name}</b></a>
                <Stars rating={Number(props.employee.rating)} jobCount={props.employee.total_ratings}  />
                { (props.showFavlist) ?
                    <p href="#">{ (favoriteCount > 0) ? <span className="badge badge-warning"><i className="fas fa-star"></i> {favoriteCount} Lists</span> : '' } {badgesHTML}</p>
                  :''
              }
            </div>
            {Array.isArray(positions) && positions.length > 0 ? (
                <div className="col-2 my-auto">
                    { positions.map((pos, i)=> {
                        if(i < 3 && pos ) return (<span key={i} className="badge badge-success">{pos.label || pos.title}</span>);
                      }
                    )}
                    {Array.isArray(positions) && positions.length > 3 ? <span className="text-right ml-4">See more</span> : null}
                </div>
            ): null}

        </div>
  
      
        {(props.children) ?
            <div className="btn-group" role="group" aria-label="Basic example">
                {props.children}
            </div>
            :''
        }
    </li>);
};
EmployeeExtendedCard.propTypes = {
  employee: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  showFavlist: PropTypes.bool,
  className: PropTypes.string,
  showButtonsOnHover: PropTypes.bool,
  hoverEffect: PropTypes.bool,
  onClick: PropTypes.func,
  positions: PropTypes.array
};
EmployeeExtendedCard.defaultProps = {
  showFavlist: true,
  className:'',
  hoverEffect: true,
  showButtonsOnHover: true,
  children: null,
  onClick: null,
  positions: null
};

export default EmployeeExtendedCard;