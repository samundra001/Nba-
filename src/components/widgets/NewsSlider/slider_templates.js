import React from 'react';
import Slick from 'react-slick';
import styles from './slider.module.css';
import { Link } from 'react-router-dom';
const SliderTemplates = (props) => {  // from props we are getting 3 articles and types
    
let template = null;

  const settings = {
      dots:false,
      infinite:true,
      arrows:false,
      speed:500,
      slidesToshow:1,
      slidesToscroll:1,
      ...props.settings // this checks and overwrite 
  }

  switch(props.type)
  {
    case('featured'):
    template = props.data.map((item,i)=>{
      return(
        <div key={i}>
          <div className={styles.featured_item}>
              <div className={styles.featured_image}
              style={{
                background:`url(../images/articles/${item.image})`
              }}></div>
            <Link to={`/articles/${item.id}`}>
            <div  className = {styles.featured_caption} >
              {item.title}
            </div>

            </Link>
          </div>

        </div>
      )
    })
    break;
    default:
      template=null;

  }


    return(
   <Slick {...settings}>
       {template}
   </Slick>

)


}
 

export default SliderTemplates;