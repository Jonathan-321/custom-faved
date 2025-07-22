import React from "react";

export const Settings = () => {
return (

    <div className="col-md-3 col-xl-2">
        <div className="offcanvas-md offcanvas-start" tabIndex={-1} id="sidebar" aria-labelledby="sidebar-label">
            <div className="offcanvas-header d-flex gap-1 p-md-0 mb-md-3">
                <h5 className="offcanvas-title me-auto" id="sidebar-label">
                    {/* <img src="/assets/images/logo.png" alt="Faved logo" className="img-fluid " width="48">
                    Faved */}
                </h5>

                <a className="btn btn-outline-secondary ms-auto active"
                   href="<?php echo $url_builder->build('/'); ?>">
                    <i className="bi bi-sliders2"></i>
                </a>

                <button type="button" className="btn-close ms-3 d-md-none" data-bs-dismiss="offcanvas"
                        data-bs-target="#sidebar"
                        aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div className="sidebar-content">

                    <div className="list-group mb-3">
                        {/* <a href="<?php echo $url_builder->build('/settings/auth'); ?>"
                           className="list-group-item list-group-item-action <?php echo ($active_tab === 'auth') ? 'active' : ''; ?>" <?php echo ($active_tab === 'auth') ? 'aria-current="true"' : ''; ?>>
                            Authentication
                        </a> */}
                        {/* <a href="<?php echo $url_builder->build('/settings/bookmarklet'); ?>"
                           className="list-group-item list-group-item-action <?php echo ($active_tab === 'bookmarklet') ? 'active' : ''; ?>" <?php echo ($active_tab === 'auth') ? 'aria-current="true"' : ''; ?>>
                            Bookmarklet
                        </a> */}
                    </div>
                    <a className="mb-3 d-block text-decoration-none" href="<?php echo $url_builder->build('/'); ?>">
                        <i className="bi bi-arrow-left"></i> Back to list
                    </a>
                </div>
            </div>
        </div>
    </div>
   


)
}


