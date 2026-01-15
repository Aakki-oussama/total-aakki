import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { iconConfig } from '../../config/icons';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        to="/"
                        className="text-muted hover:text-primary transition-colors flex items-center"
                    >
                        <Home className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                    </Link>
                </li>

                {pathnames.length > 0 && <li className="text-muted/50 truncate">
                    <ChevronRight className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                </li>}

                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    return (
                        <Fragment key={to}>
                            <li>
                                {last ? (
                                    <span className="text-primary font-bold capitalize truncate max-w-[120px] md:max-w-none">
                                        {value.replace(/-/g, ' ')}
                                    </span>
                                ) : (
                                    <Link
                                        to={to}
                                        className="text-muted hover:text-primary transition-colors capitalize truncate max-w-[120px] md:max-w-none"
                                    >
                                        {value.replace(/-/g, ' ')}
                                    </Link>
                                )}
                            </li>
                            {!last && (
                                <li className="text-muted/50">
                                    <ChevronRight className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
